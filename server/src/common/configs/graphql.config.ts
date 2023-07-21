import { registerAs } from '@nestjs/config';
import { GraphqlConfig } from './config.interface';

export const graphqlConfig = registerAs<GraphqlConfig>('graphql', () => ({
  playgroundEnabled: true,
  debug: false,
  schemaDestination: './src/schema.graphql',
  sortSchema: true,
}));
