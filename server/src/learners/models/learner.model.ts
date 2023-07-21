import { ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Learner extends User {}
