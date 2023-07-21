import { Injectable } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateCourseInput } from './inputs/create-course.input';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async course(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }

  async courses(params: {
    skip?: number;
    take?: number;
    name?: string;
    orderBy?: string;
    order?: number;
  }): Promise<Course[]> {
    const { skip, take, orderBy, order } = params;
    return this.prisma.course.findMany({
      skip,
      take,
      orderBy: { [orderBy]: order == -1 ? 'desc' : 'asc' },
    });
  }

  async createCourse(data: CreateCourseInput): Promise<Course> {
    const { lecturerId, categoryIds, ...courseInfo } = data;

    return this.prisma.course.create({
      data: {
        ...courseInfo,
        lecturerId,
        Category: { connect: categoryIds.map((id) => ({ id })) },
      },
    });
  }

  async updateCourse(params: {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.CourseUpdateInput;
  }): Promise<Course> {
    const { where, data } = params;
    return this.prisma.course.update({
      data,
      where,
    });
  }

  async deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<Course> {
    return this.prisma.course.delete({
      where,
    });
  }
}
