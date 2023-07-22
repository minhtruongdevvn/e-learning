import { PrismaClient } from '@prisma/client';

export class CategorySeed {
  static async run(prisma: PrismaClient) {
    await prisma.category.deleteMany();

    await prisma.category.createMany({
      data: this.#categories().map((c) => ({
        name: c,
        alias: c.toLowerCase().replace(' ', '_'),
      })),
    });
  }

  static #categories() {
    return [
      'UI/UX Design',
      'Art & Design',
      'Computer Science',
      'History & Archeologic',
      'Software Engineering',
      'Information Software',
      'Health & Fitness',
      'Marketing',
      'Graphic Design',
      'Music',
      'Business',
      'Web Management',
      'Mathematic',
    ];
  }
}
