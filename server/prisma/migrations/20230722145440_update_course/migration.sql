/*
  Warnings:

  - The values [LEANER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `name` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to drop the column `categoryId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `LeanerCourse` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[alias]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alias` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER', 'LECTURER', 'LEARNER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_lecturerId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRating" DROP CONSTRAINT "CourseRating_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRating" DROP CONSTRAINT "CourseRating_leanerId_fkey";

-- DropForeignKey
ALTER TABLE "LeanerCourse" DROP CONSTRAINT "LeanerCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "LeanerCourse" DROP CONSTRAINT "LeanerCourse_leanerId_fkey";

-- DropForeignKey
ALTER TABLE "Learner" DROP CONSTRAINT "Learner_userId_fkey";

-- DropForeignKey
ALTER TABLE "LectureResource" DROP CONSTRAINT "LectureResource_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Lecturer" DROP CONSTRAINT "Lecturer_userId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "alias" VARCHAR(200) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "categoryId",
DROP COLUMN "slug",
ADD COLUMN     "avgRating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "leanerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tag" TEXT,
ADD COLUMN     "totalRating" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "LeanerCourse";

-- CreateTable
CREATE TABLE "LearnerCourse" (
    "learnerId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "LearnerCourse_pkey" PRIMARY KEY ("learnerId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_alias_key" ON "Category"("alias");

-- AddForeignKey
ALTER TABLE "Lecturer" ADD CONSTRAINT "Lecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerCourse" ADD CONSTRAINT "LearnerCourse_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "Learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerCourse" ADD CONSTRAINT "LearnerCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_leanerId_fkey" FOREIGN KEY ("leanerId") REFERENCES "Learner"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureResource" ADD CONSTRAINT "LectureResource_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
