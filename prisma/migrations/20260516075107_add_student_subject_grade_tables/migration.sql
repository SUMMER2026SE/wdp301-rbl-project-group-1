/*
  Warnings:

  - You are about to drop the column `grade` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "grade";

-- CreateTable
CREATE TABLE "student_subject" (
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    CONSTRAINT "student_subject_pkey" PRIMARY KEY ("student_id","subject_id")
);

-- CreateTable
CREATE TABLE "student_grade" (
    "student_id" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,

    CONSTRAINT "student_grade_pkey" PRIMARY KEY ("student_id","grade_id")
);

-- AddForeignKey
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grade" ADD CONSTRAINT "student_grade_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grade" ADD CONSTRAINT "student_grade_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
