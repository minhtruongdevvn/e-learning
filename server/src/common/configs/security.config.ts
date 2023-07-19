import { registerAs } from '@nestjs/config';
import { SecurityConfig } from './config.interface';

export const securityConfig = registerAs<SecurityConfig>('security', () => ({
  atSecret: process.env.JWT_ACCESS_SECRET,
  rtSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '2m',
  refreshIn: '7d',
  bcryptSaltOrRound: 10,
}));
