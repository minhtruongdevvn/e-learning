import {
  Edge,
  findManyCursorConnection,
} from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Course as CourseEntity, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CoursesArg } from './args/courses.arg';
import { CreateCourseInput } from './inputs/create-course.input';
import { UpdateCourseInput } from './inputs/update-course.input';
import { CourseConnection } from './models/course-connection';
import { Course } from './models/course.model';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { Category: true, Lecturer: true }, // todo course rating
    });
  }

  async courses(args: CoursesArg): Promise<CourseConnection> {
    const { name, categoryIds, order } = args;
    const noOfTakenCategory = 3;

    const where: Prisma.CourseWhereInput = {
      OR: {
        name: { contains: name || '', mode: 'insensitive' },
        Category: { some: { id: { in: categoryIds } } },
      },
    };

    const { totalCount, pageInfo, edges } = await findManyCursorConnection(
      (args) =>
        this.prisma.course.findMany({
          where,
          include: {
            Lecturer: { include: { user: true } },
            Category: { take: noOfTakenCategory },
          },
          orderBy: order ? { [order.field]: order.direction } : undefined,
          ...args,
        }),
      () => this.prisma.course.count({ where }),
      args.pagination
    );

    const mappedEdges = edges.map((e): Edge<Course> => {
      const { Lecturer, ...node } = e.node;
      const { user, department, about } = Lecturer;
      return {
        ...e,
        node: { ...node, Lecturer: { ...user, department, about } },
      };
    });

    return { totalCount, pageInfo, edges: mappedEdges };
  }

  create(data: CreateCourseInput): Promise<CourseEntity> {
    const { lecturerId, categoryIds, ...courseInfo } = data;

    return this.prisma.course.create({
      data: {
        ...courseInfo,
        lecturerId,
        Category: { connect: categoryIds.map((id) => ({ id })) },
      },
    });
  }

  update(data: UpdateCourseInput): Promise<CourseEntity> {
    const { id, categoryIds, ...courseInfo } = data;

    return this.prisma.course.update({
      where: { id },
      data: {
        ...courseInfo,
        Category: {
          set: categoryIds.map((id) => ({ id })),
        },
      },
    });
  }

  delete(id: string): Promise<CourseEntity> {
    return this.prisma.course.delete({ where: { id } });
  }
}
