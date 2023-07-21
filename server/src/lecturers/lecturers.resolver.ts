import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateLecturerInput } from './inputs/create-lecturer.input';
import { UpdateLecturerInput } from './inputs/update-lecturer.input';
import { LecturersService } from './lecturers.service';
import { Lecturer } from './models/lecturer.model';

@Resolver()
@UseGuards(GqlAuthGuard)
@Roles('LECTURER', 'ADMIN')
export class LecturersResolver {
  constructor(private readonly lecturerService: LecturersService) {}

  @Mutation(() => Lecturer)
  createLecturer(@Args('data') data: CreateLecturerInput) {
    return this.lecturerService.create(data);
  }

  @Mutation(() => Lecturer)
  updateLecturer(@Args('data') data: UpdateLecturerInput) {
    return this.lecturerService.update(data);
  }

  @Mutation(() => Lecturer)
  deleteLecturer(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.lecturerService.delete(id);
  }
}
