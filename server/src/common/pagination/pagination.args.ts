import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;

  @Field(() => Int, { nullable: true })
  first?: number;

  @Field(() => Int, { nullable: true })
  last?: number;
}
