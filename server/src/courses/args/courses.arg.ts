import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { CourseOrderArg } from './course-order.arg';

@ArgsType()
export class CoursesArg {
  @Field(() => PaginationArgs, { nullable: true })
  pagination?: PaginationArgs;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  categoryIds?: string[];

  @Field(() => CourseOrderArg, { nullable: true })
  order?: CourseOrderArg;
}
