import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Lecturer extends User {
  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  about?: string;
}
