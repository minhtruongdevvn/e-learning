import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.interface';

export const appConfig = registerAs<AppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT),
  corEnabled: true,
}));
