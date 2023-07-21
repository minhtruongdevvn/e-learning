-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'LECTURER';
ALTER TYPE "Role" ADD VALUE 'LEANER';

-- CreateTable
CREATE TABLE "Lecturer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" TEXT,
    "about" TEXT,

    CONSTRAINT "Lecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Learner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Learner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeanerCourse" (
    "leanerId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "LeanerCourse_pkey" PRIMARY KEY ("leanerId","courseId")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "achievement" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imgURL" TEXT,
    "lecturerId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leanerId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LectureResource" (
    "id" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,

    CONSTRAINT "LectureResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_userId_key" ON "Lecturer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Learner_userId_key" ON "Learner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCourse_AB_unique" ON "_CategoryToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCourse_B_index" ON "_CategoryToCourse"("B");

-- AddForeignKey
ALTER TABLE "Lecturer" ADD CONSTRAINT "Lecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Learner" ADD CONSTRAINT "Learner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeanerCourse" ADD CONSTRAINT "LeanerCourse_leanerId_fkey" FOREIGN KEY ("leanerId") REFERENCES "Learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeanerCourse" ADD CONSTRAINT "LeanerCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_leanerId_fkey" FOREIGN KEY ("leanerId") REFERENCES "Learner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRating" ADD CONSTRAINT "CourseRating_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LectureResource" ADD CONSTRAINT "LectureResource_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCourse" ADD CONSTRAINT "_CategoryToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCourse" ADD CONSTRAINT "_CategoryToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
