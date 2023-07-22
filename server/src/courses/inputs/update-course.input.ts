import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateCourseInput } from './create-course.input';

@InputType()
export class UpdateCourseInput extends PartialType(
  OmitType(CreateCourseInput, ['lecturerId'])
) {
  @Field(() => ID)
  id: string;
}
