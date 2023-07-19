import {
  AppConfig,
  GraphqlConfig,
  SecurityConfig,
  SwaggerConfig,
} from './config.interface';

export interface AllConfigType {
  app: AppConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  swagger: SwaggerConfig;
}

export * from './app.config';
export * from './config.interface';
export * from './graphql.config';
export * from './security.config';
export * from './swagger.config';
