import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateLearnerInput } from './create-learner.input';

@InputType()
export class UpdateLearnerInput extends PartialType(CreateLearnerInput) {
  @Field(() => ID)
  id: string;
}
