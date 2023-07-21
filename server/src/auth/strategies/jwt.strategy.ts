import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AllConfigType, SecurityConfig } from 'src/common/configs';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService<AllConfigType>
  ) {
    const securityConfig: SecurityConfig = configService.getOrThrow(
      'security',
      { infer: true }
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: securityConfig.atSecret,
    });
  }

  async validate(data: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(data.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
