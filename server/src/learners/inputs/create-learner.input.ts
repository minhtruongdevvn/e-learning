import { InputType } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/inputs/create-user.input';

@InputType()
export class CreateLearnerInput extends CreateUserInput {}
