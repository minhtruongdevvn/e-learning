import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';

export enum CourseOrderField {
  name = 'name',
  avgRating = 'avgRating',
  totalRating = 'totalRating',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  price = 'price',
}

registerEnumType(CourseOrderField);

@ArgsType()
export class CourseOrderArg extends Order {
  @Field(() => CourseOrderField)
  field: CourseOrderField;
}
