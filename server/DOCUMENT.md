## Prisma Setup

### 1. Install Dependencies

Install [Nestjs CLI](https://docs.nestjs.com/cli/usages) to start and [generate CRUD resources](https://trilon.io/blog/introducing-cli-generators-crud-api-in-1-minute)

```bash
# npm
npm i -g @nestjs/cli
# yarn
yarn add -g @nestjs/cli
```

Install the dependencies for the Nest application:

```bash
# npm
npm install
# yarn
yarn install
```

### 2. PostgreSQL with Docker

Setup a development PostgreSQL with Docker. Copy [.env.example](./.env.example) and rename to `.env` - `cp .env.example .env` - which sets the required environments for PostgreSQL such as `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`. Update the variables as you wish and select a strong password.

Start the PostgreSQL database

```bash
docker-compose -f docker-compose.db.yml up -d
# or
npm run docker:db
```

### 3. Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. Prisma reads the `DATABASE_URL` from the root [.env](./.env) file.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npx prisma migrate dev
# or
npm run migrate:dev
```

If you like to customize your `migration.sql` file run the following command. After making your customizations run `npx prisma migrate dev` to apply it.

```bash
npx prisma migrate dev --create-only
# or
npm run migrate:dev:create
```

If you are happy with your database changes you want to deploy those changes to your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments). Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without prompts.

```bash
npx prisma migrate deploy
# or
npm run migrate:deploy
```

### 4. Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model.

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
npm run prisma:generate
```

### 5. Seed the database data with this script

Execute the script with this command:

```bash
npm run seed
```

### 6. Start NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:dev
```

Run Nest Server in Production mode:

```bash
npm run start:prod
```

GraphQL Playground for the NestJS Server is available here: http://localhost:3000/graphql

## GraphQL Playground

Open up the [example GraphQL queries](graphql/auth.graphql) and copy them to the GraphQL Playground. Some queries and mutations are secured by an auth guard. You have to acquire a JWT token from `signup` or `login`. Add the `accessToken`as followed to **HTTP HEADERS** in the playground and replace `YOURTOKEN` here:

```json
{
  "Authorization": "Bearer YOURTOKEN"
}
```

## Rest Api

[RESTful API](http://localhost:3000/api) documentation available with Swagger.

## Docker

Nest server is a Node.js application and it is easily [dockerized](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/).

See the [Dockerfile](./Dockerfile) on how to build a Docker image of your Nest server.

Now to build a Docker image of your own Nest server simply run:

```bash
# give your docker image a name
docker build -t <your username>/nest-prisma-server .
# for example
docker build -t nest-prisma-server .
```

After Docker build your docker image you are ready to start up a docker container running the nest server:

```bash
docker run -d -t -p 3000:3000 --env-file .env nest-prisma-server
```

Now open up [localhost:3000](http://localhost:3000) to verify that your nest server is running.

When you run your NestJS application in a Docker container update your [.env](.env) file

```diff
- DB_HOST=localhost
# replace with name of the database container
+ DB_HOST=postgres

# Prisma database connection
+ DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer
```

### Docker Compose

You can also setup a the database and Nest application with the docker-compose

```bash
# building new NestJS docker image
docker-compose build
# or
npm run docker:build

# start docker-compose
docker-compose up -d
# or
npm run docker
```

## Schema Development

Update the Prisma schema `prisma/schema.prisma` and after that run the following two commands:

```bash
npx prisma generate
# or in watch mode
npx prisma generate --watch
# or
npm run prisma:generate
npm run prisma:generate:watch
```

## NestJS - Api Schema

The [schema.graphql](./src/schema.graphql) is generated with [code first approach](https://docs.nestjs.com/graphql/quick-start#code-first) from the models, resolvers and input classes.

You can use [class-validator](https://docs.nestjs.com/techniques/validation) to validate your inputs and arguments.

### Resolver

To implement the new query, a new resolver function needs to be added to `users.resolver.ts`.

```ts
@Query(returns => User)
async getUser(@Args() args): Promise<User> {
  return await this.prisma.client.user(args);
}
```

Restart the NestJS server and this time the Query to fetch a `user` should work.

## GraphQL Client

A GraphQL client is necessary to consume the GraphQL api provided by the NestJS Server.

Checkout [Apollo](https://www.apollographql.com/) a popular GraphQL client which offers several clients for React, Angular, Vue.js, Native iOS, Native Android and more.

#### Queries

To execute a query you can use:

```ts
this.apollo.query({query: YOUR_QUERY});

# or

this.apollo.watchQuery({
  query: YOUR_QUERY
}).valueChanges;
```

Here is an example how to fetch your profile from the NestJS GraphQL Api:

```ts
const CurrentUserProfile = gql`
  query CurrentUserProfile {
    me {
      id
      email
      name
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({
      query: CurrentUserProfile,
    }).valueChanges;
  }
}
```

Use the `AsyncPipe` and [SelectPipe](https://www.apollographql.com/docs/angular/basics/queries.html#select-pipe) to unwrap the data Observable in the template:

```html
<div *ngIf="data | async | select: 'me' as me">
  <p>Me id: {{me.id}}</p>
  <p>Me email: {{me.email}}</p>
  <p>Me name: {{me.name}}</p>
</div>
```

Or unwrap the data using [RxJs](https://www.apollographql.com/docs/angular/basics/queries.html#rxjs).

This will end up in an `GraphQL error` because `Me` is protected by an `@UseGuards(GqlAuthGuard)` and requires an `Bearer TOKEN`.
Please refer to the [Authentication](#authentication) section.

#### Mutations

To execute a mutation you can use:

```ts
this.apollo.mutate({
  mutation: YOUR_MUTATION,
});
```

Here is an example how to login into your profile using the `login` Mutation:

```ts
const Login = gql`
  mutation Login {
    login(email: "test@example.com", password: "pizzaHawaii") {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.mutate({
      mutation: Login,
    });
  }
}
```

#### Subscriptions

To execute a subscription you can use:

```ts
this.apollo.subscribe({
  query: YOUR_SUBSCRIPTION_QUERY,
});
```

#### Authentication

To authenticate your requests you have to add your `TOKEN` you receive on `signup` and `login` [mutation](#mutations) to each request which is protected by the `@UseGuards(GqlAuthGuard)`.

Because the apollo client is using `HttpClient` under the hood you are able to simply use an `Interceptor` to add your token to the requests.

Create the following class:

```ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = 'YOUR_TOKEN'; // get from local storage
    if (token !== undefined) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}
```

Add the Interceptor to the `AppModule` providers like this:

```ts
providers: [
    ...
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ...
  ]
```

After you configured the Interceptor and retrieved the `TOKEN` from storage your request will succeed on resolvers with `@UseGuards(GqlAuthGuard)`.

---

#### Project boilerplate repo: https://github.com/notiz-dev/nestjs-prisma-starter