import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AllConfigType } from 'src/common/configs';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { Token } from './models/token.model';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  private readonly securityConfig: SecurityConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    configService: ConfigService<AllConfigType>
  ) {
    this.securityConfig = configService.getOrThrow('security');
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(data: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(data),
      refreshToken: this.generateRefreshToken(data),
    };
  }

  private generateAccessToken(data: { userId: string }): string {
    return this.jwtService.sign(data);
  }

  private generateRefreshToken(data: { userId: string }): string {
    return this.jwtService.sign(data, {
      secret: this.securityConfig.rtSecret,
      expiresIn: this.securityConfig.refreshIn,
    });
  }

  refreshToken(token: string): Token {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.securityConfig.rtSecret,
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
