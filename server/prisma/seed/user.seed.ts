import { Prisma, PrismaClient, Role } from '@prisma/client';

export class UserSeed {
  static async run(prisma: PrismaClient) {
    await prisma.user.deleteMany();
    await Promise.all(
      this.#users().map((data) => prisma.user.create({ data }))
    );
  }

  static #users(): Prisma.UserCreateInput[] {
    return [
      {
        email: 'lisa@simpson.com',
        firstname: 'Lisa',
        lastname: 'Simpson',
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
        role: Role.LEARNER,
        learner: { create: {} },
      },
      {
        email: 'bart@simpson.com',
        firstname: 'Bart',
        lastname: 'Simpson',
        role: Role.LECTURER,
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42,
        lecturer: {
          create: {
            department: 'Mathematics and Programming',
            about:
              "John Greene earned a bachelor's degree in Mathematics and a master's degree in Economics. Throughout his career, he has helped thousands of students ace their math and economics courses. Additionally, John has helped students learn advanced programming concepts and break into the field of web development. John has a passion for teaching and helping students achieve their goals.",
          },
        },
      },
      {
        email: 'deft@simpson.com',
        firstname: 'Deft',
        lastname: 'Simpson',
        role: Role.ADMIN,
        password:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // secret42
      },
    ];
  }
}
