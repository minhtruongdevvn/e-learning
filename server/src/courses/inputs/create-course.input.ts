import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field()
  achievement: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field(() => ID)
  lecturerId: string;

  @Field(() => [ID])
  categoryIds: string[];
}
