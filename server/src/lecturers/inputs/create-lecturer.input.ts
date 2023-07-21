import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/inputs/create-user.input';

@InputType()
export class CreateLecturerInput extends CreateUserInput {
  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  about?: string;
}
