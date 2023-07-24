import { ForbiddenException } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Token } from 'src/auth/models/token.model';
import { AuthGuardWithRole } from 'src/common/decorators/auth.decorator';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { CreateLearnerInput } from './inputs/create-learner.input';
import { UpdateLearnerInput } from './inputs/update-learner.input';
import { LearnersService } from './learners.service';
import { Learner } from './models/learner.model';

@Resolver()
@AuthGuardWithRole()
export class LearnersResolver {
  constructor(private readonly learnerService: LearnersService) {}

  @IsPublic()
  @Mutation(() => Token)
  createLearner(@Args('data') data: CreateLearnerInput) {
    return this.learnerService.create(data);
  }

  @Mutation(() => Learner)
  updateLearner(@Args('data') data: UpdateLearnerInput) {
    return this.learnerService.update(data);
  }

  @Mutation(() => Learner)
  deleteLearner(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.learnerService.delete(id);
  }

  @Mutation(() => Learner, { name: 'learnerSelfDelete' })
  async selfDelete(@UserEntity() user: User) {
    const exists = await this.learnerService.exists({ userId: user.id });
    if (!exists) throw new ForbiddenException();

    return this.learnerService.delete(user.id);
  }
}
