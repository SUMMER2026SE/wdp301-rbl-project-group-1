/*
  Warnings:

  - Changed the type of `level` on the `course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum (idempotent for partial-apply recovery)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_application_status') THEN
        CREATE TYPE "course_application_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
        CREATE TYPE "course_level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
        CREATE TYPE "resource_type" AS ENUM ('FILE', 'VIDEO', 'LINK', 'DOCUMENT');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InteractionEntityType') THEN
        CREATE TYPE "InteractionEntityType" AS ENUM ('TUTOR', 'COURSE');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InteractionEventType') THEN
        CREATE TYPE "InteractionEventType" AS ENUM ('VIEW', 'CLICK', 'FAVORITE', 'ENROLL', 'SEARCH_CLICK');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_type') THEN
        CREATE TYPE "assessment_type" AS ENUM ('QUIZ', 'EXAM');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
        CREATE TYPE "question_type" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'TEXT_ANSWER');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_difficulty') THEN
        CREATE TYPE "question_difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grading_policy') THEN
        CREATE TYPE "grading_policy" AS ENUM ('HIGHEST', 'AVERAGE', 'LATEST');
    END IF;
END $$;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "course_status" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';
ALTER TYPE "course_status" ADD VALUE IF NOT EXISTS 'REJECTED';

-- AlterTable (preserve data when converting from old enum/text)
UPDATE "course"
SET "level" = 'BEGINNER'
WHERE "level" IS NULL;

ALTER TABLE "course"
ALTER COLUMN "level" TYPE "course_level"
USING ("level"::text::"course_level");

ALTER TABLE "course"
ALTER COLUMN "level" SET NOT NULL;

-- AlterTable
ALTER TABLE "lesson_attendance" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tutor_application" ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropEnum
DROP TYPE IF EXISTS "CourseLevel";

-- CreateTable
CREATE TABLE "user_subject_interest" (
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "user_subject_interest_pkey" PRIMARY KEY ("user_id","subject_id")
);

-- CreateTable
CREATE TABLE "course_application" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "status" "course_application_status" NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_type" "InteractionEntityType" NOT NULL,
    "event_type" "InteractionEventType" NOT NULL,
    "weight" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tutor_recommendation" (
    "user_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_tutor_recommendation_pkey" PRIMARY KEY ("user_id","tutor_id")
);

-- CreateTable
CREATE TABLE "user_course_recommendation" (
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_course_recommendation_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateTable
CREATE TABLE "tutor_similarity" (
    "tutor_id" TEXT NOT NULL,
    "similar_tutor_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "tutor_similarity_pkey" PRIMARY KEY ("tutor_id","similar_tutor_id")
);

-- CreateTable
CREATE TABLE "course_similarity" (
    "course_id" TEXT NOT NULL,
    "similar_course_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "course_similarity_pkey" PRIMARY KEY ("course_id","similar_course_id")
);

-- CreateTable
CREATE TABLE "resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "resource_type" NOT NULL,
    "size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_resource" (
    "course_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_resource_pkey" PRIMARY KEY ("course_id","resource_id")
);

-- CreateTable
CREATE TABLE "lesson_resource" (
    "lesson_id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_resource_pkey" PRIMARY KEY ("lesson_id","resource_id")
);

-- CreateTable
CREATE TABLE "assessment" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "lesson_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "assessment_type" NOT NULL,
    "max_attempts" INTEGER,
    "time_limit" INTEGER,
    "is_randomized" BOOLEAN NOT NULL DEFAULT false,
    "shuffle_options" BOOLEAN NOT NULL DEFAULT false,
    "anti_cheat" BOOLEAN NOT NULL DEFAULT false,
    "pass_score" DOUBLE PRECISION,
    "grading_policy" "grading_policy" NOT NULL DEFAULT 'HIGHEST',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT,
    "bank_id" TEXT,
    "type" "question_type" NOT NULL,
    "difficulty" "question_difficulty" NOT NULL DEFAULT 'MEDIUM',
    "content" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "is_passed" BOOLEAN,

    CONSTRAINT "attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_answer" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_ids" TEXT[],
    "text_answer" TEXT,
    "is_correct" BOOLEAN,
    "points" DOUBLE PRECISION,

    CONSTRAINT "attempt_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_bank_config" (
    "id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "bank_id" TEXT NOT NULL,
    "difficulty" "question_difficulty",
    "count" INTEGER NOT NULL,
    "points_per_question" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "assessment_bank_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gradebook_record" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "final_score" DOUBLE PRECISION NOT NULL,
    "is_passed" BOOLEAN NOT NULL,
    "best_attempt_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gradebook_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_application_course_id_key" ON "course_application"("course_id");

-- CreateIndex
CREATE INDEX "course_application_status_idx" ON "course_application"("status");

-- CreateIndex
CREATE INDEX "course_application_created_at_idx" ON "course_application"("created_at");

-- CreateIndex
CREATE INDEX "interaction_user_id_idx" ON "interaction"("user_id");

-- CreateIndex
CREATE INDEX "interaction_entity_id_entity_type_idx" ON "interaction"("entity_id", "entity_type");

-- CreateIndex
CREATE INDEX "interaction_created_at_idx" ON "interaction"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "gradebook_record_best_attempt_id_key" ON "gradebook_record"("best_attempt_id");

-- CreateIndex
CREATE UNIQUE INDEX "gradebook_record_student_id_assessment_id_key" ON "gradebook_record"("student_id", "assessment_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "course_level_idx" ON "course"("level");

-- AddForeignKey
ALTER TABLE "user_subject_interest" ADD CONSTRAINT "user_subject_interest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subject_interest" ADD CONSTRAINT "user_subject_interest_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_application" ADD CONSTRAINT "course_application_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_application" ADD CONSTRAINT "course_application_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interaction" ADD CONSTRAINT "interaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_resource" ADD CONSTRAINT "course_resource_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_resource" ADD CONSTRAINT "course_resource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_resource" ADD CONSTRAINT "lesson_resource_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_resource" ADD CONSTRAINT "lesson_resource_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "question_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bank" ADD CONSTRAINT "question_bank_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_bank_config" ADD CONSTRAINT "assessment_bank_config_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_bank_config" ADD CONSTRAINT "assessment_bank_config_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "question_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gradebook_record" ADD CONSTRAINT "gradebook_record_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gradebook_record" ADD CONSTRAINT "gradebook_record_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gradebook_record" ADD CONSTRAINT "gradebook_record_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gradebook_record" ADD CONSTRAINT "gradebook_record_best_attempt_id_fkey" FOREIGN KEY ("best_attempt_id") REFERENCES "attempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
