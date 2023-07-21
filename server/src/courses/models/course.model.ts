import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';
import { BaseModel } from 'src/common/models/base.model';
import { Lecturer } from 'src/lecturers/models/lecturer.model';

export const orderByOptions = ['name', 'avgRating'] as const;
export type OrderByOptions = (typeof orderByOptions)[number];

@ObjectType()
export class Course extends BaseModel {
  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  avgRating: number;

  @Field(() => Int)
  totalRating: number;

  @Field(() => Int)
  leanerCount: number;

  @Field()
  achievement: string;

  @Field({ nullable: true })
  description: string | null;

  @Field({ nullable: true })
  imgURL: string | null;

  @Field(() => Lecturer)
  lecturer: Lecturer;

  @Field()
  categories: Category[];
}
