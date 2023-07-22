import { Category, Prisma, PrismaClient } from '@prisma/client';

export class CourseSeed {
  static async run(prisma: PrismaClient) {
    await prisma.course.deleteMany();

    const { id: lectureId } = await prisma.lecturer.findFirstOrThrow({
      select: { id: true },
    });

    const categories = await prisma.category.findMany({
      where: { name: { in: ['Business', 'Mathematic'] } },
    });

    await Promise.all(
      this.#courses(lectureId, categories).map((data) =>
        prisma.course.create({ data })
      )
    );
  }

  static #courses(
    lectureId: string,
    categories: Category[]
  ): Prisma.CourseCreateInput[] {
    return [
      {
        name: 'College Algebra, Pre-Calculus, & Trigonometry Explained',
        price: 60.5,
        achievement:
          'Solving Rational Equations and Inequalities;The Rectangular Coordinate Plane;Distance and Midpoint Formulas;Domain and Range;Graphing Linear Equations;Graphing Circles;Graphing Transformations;Matrix Algebra',
        description:
          'Master College Level Algebra with our Step by Step Video Tutorials. Over 4500 Practice Questions! Ace your Algebra Exam!',
        lecturer: { connect: { id: lectureId } },
        categories: {
          connect: categories
            .filter((e) => e.name === 'Mathematic')
            .map(({ id }) => ({ id })),
        },
      },
      {
        name: 'Digital Marketing Agency | The Seven Figure Agency road map',
        price: 25,
        achievement:
          'The Niche Selection Brainstorm - How to Choose Your Niche;The Ultimate Agency Funnel;The Client Attraction Method;How to SCALE Your Agency by building your team & procedures;How To Land Clients & Grow Your Agency;The Cold Outreach Formula',
        description: 'How to build a Million Dollar Digital Marketing Agency',
        lecturer: { connect: { id: lectureId } },
        categories: {
          connect: categories
            .filter((e) => e.name === 'Business')
            .map(({ id }) => ({ id })),
        },
      },
    ];
  }
}
