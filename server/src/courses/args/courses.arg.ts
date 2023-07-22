import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';
import { PaginationArgs } from 'src/common/pagination/pagination.args';

export enum CourseOrderField {
  name = 'name',
  avgRating = 'avgRating',
  totalRating = 'totalRating',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  price = 'price',
}
registerEnumType(CourseOrderField, { name: 'CourseOrderField' });

@InputType()
export class CourseOrderArg extends Order {
  @Field(() => CourseOrderField)
  field: CourseOrderField;
}

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
