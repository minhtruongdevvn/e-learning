import { PrismaClient } from '@prisma/client';
import { CategorySeed } from './category.seed';
import { CourseSeed } from './course.seed';
import { UserSeed } from './user.seed';

async function main() {
  const prisma = new PrismaClient();

  await CategorySeed.run(prisma);
  await UserSeed.run(prisma);
  await CourseSeed.run(prisma);

  return prisma;
}

main()
  .then(async (prisma) => {
    await prisma.$disconnect();
  })
  .catch((e) => console.error(e));
