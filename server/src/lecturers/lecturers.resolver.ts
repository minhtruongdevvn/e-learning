import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Token } from 'src/auth/models/token.model';
import { AuthGuardWithRole } from 'src/common/decorators/auth.decorator';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { CreateLecturerInput } from './inputs/create-lecturer.input';
import { UpdateLecturerInput } from './inputs/update-lecturer.input';
import { LecturersService } from './lecturers.service';
import { Lecturer } from './models/lecturer.model';

@Resolver()
@AuthGuardWithRole()
export class LecturersResolver {
  constructor(private readonly lecturerService: LecturersService) {}

  @IsPublic()
  @Mutation(() => Token)
  createLecturer(@Args('data') data: CreateLecturerInput) {
    return this.lecturerService.create(data);
  }

  @Mutation(() => Lecturer)
  updateLecturer(@Args('data') data: UpdateLecturerInput) {
    return this.lecturerService.update(data);
  }

  @Mutation(() => Lecturer, { name: 'lecturerSelfDelete' })
  async deleteLecturer(@UserEntity() user: User) {
    const exists = await this.lecturerService.exists({ userId: user.id });
    if (!exists) throw new ForbiddenException();

    return this.lecturerService.delete(user.id);
  }
}
