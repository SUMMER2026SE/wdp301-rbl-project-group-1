/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `grade_id` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('KNOWLEDGE', 'SKILL', 'TOOL');

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "grade_id" TEXT NOT NULL,
ADD COLUMN     "subject_id" TEXT NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "CourseLevel" NOT NULL;

-- DropTable
DROP TABLE "Otp";

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT,
    "code_hash" TEXT NOT NULL,
    "type" "OtpType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "last_sent_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "TagCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tag" (
    "course_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "course_tag_pkey" PRIMARY KEY ("course_id","tag_id")
);

-- CreateIndex
CREATE INDEX "otp_email_type_idx" ON "otp"("email", "type");

-- CreateIndex
CREATE INDEX "otp_user_id_idx" ON "otp"("user_id");

-- CreateIndex
CREATE INDEX "otp_expires_at_idx" ON "otp"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "subject_slug_key" ON "subject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "grade_slug_key" ON "grade"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tag_slug_key" ON "tag"("slug");

-- CreateIndex
CREATE INDEX "course_subject_id_idx" ON "course"("subject_id");

-- CreateIndex
CREATE INDEX "course_grade_id_idx" ON "course"("grade_id");

-- CreateIndex
CREATE INDEX "course_level_idx" ON "course"("level");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tag" ADD CONSTRAINT "course_tag_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tag" ADD CONSTRAINT "course_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
