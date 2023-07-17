import { registerAs } from '@nestjs/config';
import { SwaggerConfig } from './config.interface';

export const swaggerConfig = registerAs<SwaggerConfig>('swagger', () => ({
  enabled: true,
  title: 'Nestjs FTW',
  description: 'The nestjs API description',
  version: '1.5',
  path: 'api',
}));
