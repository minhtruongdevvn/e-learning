import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CoursesArg } from './args/courses.arg';
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './inputs/create-course.input';
import { UpdateCourseInput } from './inputs/update-course.input';
import { Course } from './models/course.model';

@Resolver()
export class CoursesResolver {
  constructor(private readonly courseService: CoursesService) {}

  @Query(() => Course)
  course(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.courseService.getById(id);
  }

  @Query(() => [Course])
  courses(@Args() args: CoursesArg) {
    return this.courseService.courses(args);
  }

  @Mutation(() => Course)
  createCourse(@Args('data') data: CreateCourseInput) {
    return this.courseService.create(data);
  }

  @Mutation(() => Course)
  updateCourse(@Args('data') data: UpdateCourseInput) {
    return this.courseService.update(data);
  }

  @Mutation(() => Course)
  deleteCourse(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.courseService.delete(id);
  }
}
