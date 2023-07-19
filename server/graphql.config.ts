import * as dotenv from 'dotenv';
dotenv.config();

export default {
  projects: {
    'nest-prisma-starter': {
      schemaPath: 'src/schema.graphql',
      extensions: {
        endpoints: {
          dev: `http://${process.env.HOST}:${process.env.PORT}/graphql`,
        },
      },
    },
  },
};
