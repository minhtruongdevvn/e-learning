import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateLearnerInput } from './inputs/create-learner.input';
import { UpdateLearnerInput } from './inputs/update-learner.input';
import { LearnersService } from './learners.service';
import { Learner } from './models/learner.model';

@Resolver()
@UseGuards(GqlAuthGuard)
@Roles('LEARNER', 'ADMIN')
export class LearnersResolver {
  constructor(private readonly learnerService: LearnersService) {}

  @Mutation(() => Learner)
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
}
