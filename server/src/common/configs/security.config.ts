import { registerAs } from '@nestjs/config';
import { SecurityConfig } from './config.interface';

export const securityConfig = registerAs<SecurityConfig>('security', () => ({
  expiresIn: '2m',
  refreshIn: '7d',
  bcryptSaltOrRound: 10,
}));
