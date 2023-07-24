import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AllConfigType } from 'src/common/configs';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { clientError } from 'src/common/enums/client-error.enum';
import { ClientErrorException } from 'src/common/exceptions/client-error.exception';
import { Token } from './models/token.model';
import { PasswordService } from './password.service';

type Claim = { userId: string } & Pick<User, 'role'> &
  Partial<Pick<User, 'firstname' | 'lastname'>>;
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
      throw new ClientErrorException(
        clientError.NOT_FOUND,
        `No user found for email: ${email}`
      );
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new ClientErrorException(
        clientError.UNPROCESSABLE_ENTITY,
        'Invalid password'
      );
    }

    return this.generateTokens(user);
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  async generateTokens(data: User | string): Promise<Token> {
    let actualUser: User;
    if (typeof data === 'string') {
      actualUser = await this.prisma.user.findUnique({
        where: { id: data },
      });
    } else {
      actualUser = data;
    }

    const claim: Claim = {
      userId: actualUser.id,
      role: actualUser.role,
      firstname: actualUser.firstname,
      lastname: actualUser.lastname,
    };

    return {
      accessToken: this.generateAccessToken(claim),
      refreshToken: this.generateRefreshToken(claim.userId),
    };
  }

  private generateAccessToken(data: Claim): string {
    return this.jwtService.sign(data);
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.securityConfig.rtSecret,
        expiresIn: this.securityConfig.refreshIn,
      }
    );
  }

  refreshToken(token: string): Promise<Token> {
    try {
      const { userId }: { userId: string } = this.jwtService.verify(token, {
        secret: this.securityConfig.rtSecret,
      });

      return this.generateTokens(userId);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
