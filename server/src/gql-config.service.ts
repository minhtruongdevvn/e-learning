import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { GraphqlConfig } from './common/configs/config.interface';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql');
    return {
      // schema options
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoTransformHttpErrors: true,
      formatError: this.formatError,
      // subscription
      installSubscriptionHandlers: true,
      includeStacktraceInErrorResponses: graphqlConfig.debug,
      playground: false,
      plugins: [
        graphqlConfig.playgroundEnabled
          ? ApolloServerPluginLandingPageLocalDefault()
          : undefined,
      ],
      context: ({ req }) => ({ req }),
    };
  }

  private formatError(_: any, error: GraphQLError) {
    const errorMsg = error.extensions?.originalError?.['message'];
    if (
      errorMsg &&
      (typeof errorMsg === 'string' || errorMsg instanceof String)
    ) {
      const [type, description] = errorMsg.split('/');

      if (type) {
        error.message = undefined;
        error.extensions.originalError = {
          type,
          description,
        };
      }
    }

    return error;
  }
}
