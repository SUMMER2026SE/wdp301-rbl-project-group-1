/*
  Warnings:

  - You are about to drop the `schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule_student` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `end_time` to the `lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "lesson_status" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_course_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_student" DROP CONSTRAINT "schedule_student_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_student" DROP CONSTRAINT "schedule_student_student_id_fkey";

-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "meeting_url" TEXT,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "lesson_status" NOT NULL DEFAULT 'SCHEDULED';

-- DropTable
DROP TABLE "schedule";

-- DropTable
DROP TABLE "schedule_student";

-- DropEnum
DROP TYPE "schedule_status";
