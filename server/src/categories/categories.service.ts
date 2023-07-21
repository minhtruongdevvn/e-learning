import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCategoryInput) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        alias: data.name.toLowerCase().replace(' ', '_'),
      },
    });
  }

  update(data: UpdateCategoryInput) {
    return this.prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        alias: data.name?.toLowerCase().replace(' ', '_'),
      },
    });
  }

  delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
