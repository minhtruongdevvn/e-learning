import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateLecturerInput } from './create-lecturer.input';

@InputType()
export class UpdateLecturerInput extends PartialType(
  OmitType(CreateLecturerInput, ['email', 'password'] as const)
) {
  @Field(() => ID)
  id: string;
}
