import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { AuthModule } from 'src/auth/auth.module';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/role.guard';
import {
  appConfig,
  graphqlConfig,
  securityConfig,
  swaggerConfig,
} from './common/configs';
import { CustomExceptionFilter } from './common/filters/custom-gql-exception.filter';
import { PrismaExceptionTransformInterceptor } from './common/interceptors/prisma-exception-transform.interceptor';
import { CoursesModule } from './courses/courses.module';
import { GqlConfigService } from './gql-config.service';
import { LearnersModule } from './learners/learners.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig, graphqlConfig, securityConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    PostsModule,
    CoursesModule,
    LecturersModule,
    LearnersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: PrismaExceptionTransformInterceptor },
    { provide: APP_FILTER, useClass: CustomExceptionFilter },
  ],
})
export class AppModule {}
