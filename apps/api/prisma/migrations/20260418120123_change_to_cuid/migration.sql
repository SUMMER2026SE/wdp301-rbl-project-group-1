/*
  Warnings:

  - The primary key for the `activity_log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `conversation_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `course_review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `course_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `enrollment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notification_target` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `parent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `parent_student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `schedule_student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `system_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tutor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tutor_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_user_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_participant" DROP CONSTRAINT "conversation_participant_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_participant" DROP CONSTRAINT "conversation_participant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_tutor_id_fkey";

-- DropForeignKey
ALTER TABLE "course_review" DROP CONSTRAINT "course_review_course_id_fkey";

-- DropForeignKey
ALTER TABLE "course_review" DROP CONSTRAINT "course_review_student_id_fkey";

-- DropForeignKey
ALTER TABLE "course_stats" DROP CONSTRAINT "course_stats_course_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollment" DROP CONSTRAINT "enrollment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollment" DROP CONSTRAINT "enrollment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_course_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_target" DROP CONSTRAINT "notification_target_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_target" DROP CONSTRAINT "notification_target_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parent" DROP CONSTRAINT "parent_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_student" DROP CONSTRAINT "parent_student_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_student" DROP CONSTRAINT "parent_student_student_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_category" DROP CONSTRAINT "post_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "post_category" DROP CONSTRAINT "post_category_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_like" DROP CONSTRAINT "post_like_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_like" DROP CONSTRAINT "post_like_user_id_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_reporter_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_course_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_student" DROP CONSTRAINT "schedule_student_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_student" DROP CONSTRAINT "schedule_student_student_id_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_id_fkey";

-- DropForeignKey
ALTER TABLE "tutor" DROP CONSTRAINT "tutor_id_fkey";

-- DropForeignKey
ALTER TABLE "tutor_stats" DROP CONSTRAINT "tutor_stats_tutor_id_fkey";

-- AlterTable
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "activity_log_id_seq";

-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "category_id_seq";

-- AlterTable
ALTER TABLE "comment" DROP CONSTRAINT "comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comment_id_seq";

-- AlterTable
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "conversation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "conversation_id_seq";

-- AlterTable
ALTER TABLE "conversation_participant" DROP CONSTRAINT "conversation_participant_pkey",
ALTER COLUMN "conversation_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "conversation_participant_pkey" PRIMARY KEY ("conversation_id", "user_id");

-- AlterTable
ALTER TABLE "course" DROP CONSTRAINT "course_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tutor_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "course_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "course_id_seq";

-- AlterTable
ALTER TABLE "course_review" DROP CONSTRAINT "course_review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "course_review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "course_review_id_seq";

-- AlterTable
ALTER TABLE "course_stats" DROP CONSTRAINT "course_stats_pkey",
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "course_stats_pkey" PRIMARY KEY ("course_id");

-- AlterTable
ALTER TABLE "enrollment" DROP CONSTRAINT "enrollment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "enrollment_id_seq";

-- AlterTable
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "lesson_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "lesson_id_seq";

-- AlterTable
ALTER TABLE "message" DROP CONSTRAINT "message_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "conversation_id" SET DATA TYPE TEXT,
ALTER COLUMN "sender_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "message_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "message_id_seq";

-- AlterTable
ALTER TABLE "notification" DROP CONSTRAINT "notification_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "notification_id_seq";

-- AlterTable
ALTER TABLE "notification_target" DROP CONSTRAINT "notification_target_pkey",
ALTER COLUMN "notification_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notification_target_pkey" PRIMARY KEY ("notification_id", "user_id");

-- AlterTable
ALTER TABLE "parent" DROP CONSTRAINT "parent_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "parent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "parent_student" DROP CONSTRAINT "parent_student_pkey",
ALTER COLUMN "parent_id" SET DATA TYPE TEXT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "parent_student_pkey" PRIMARY KEY ("parent_id", "student_id");

-- AlterTable
ALTER TABLE "payment" DROP CONSTRAINT "payment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "payment_id_seq";

-- AlterTable
ALTER TABLE "post" DROP CONSTRAINT "post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_id_seq";

-- AlterTable
ALTER TABLE "post_category" DROP CONSTRAINT "post_category_pkey",
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_category_pkey" PRIMARY KEY ("post_id", "category_id");

-- AlterTable
ALTER TABLE "post_like" DROP CONSTRAINT "post_like_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_like_pkey" PRIMARY KEY ("user_id", "post_id");

-- AlterTable
ALTER TABLE "profile" DROP CONSTRAINT "profile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "profile_id_seq";

-- AlterTable
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "refresh_token_id_seq";

-- AlterTable
ALTER TABLE "report" DROP CONSTRAINT "report_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "reporter_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "report_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "report_id_seq";

-- AlterTable
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "course_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "schedule_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "schedule_id_seq";

-- AlterTable
ALTER TABLE "schedule_student" DROP CONSTRAINT "schedule_student_pkey",
ALTER COLUMN "schedule_id" SET DATA TYPE TEXT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "schedule_student_pkey" PRIMARY KEY ("schedule_id", "student_id");

-- AlterTable
ALTER TABLE "student" DROP CONSTRAINT "student_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "system_stats" DROP CONSTRAINT "system_stats_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "system_stats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "system_stats_id_seq";

-- AlterTable
ALTER TABLE "tutor" DROP CONSTRAINT "tutor_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tutor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tutor_stats" DROP CONSTRAINT "tutor_stats_pkey",
ALTER COLUMN "tutor_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tutor_stats_pkey" PRIMARY KEY ("tutor_id");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_student" ADD CONSTRAINT "schedule_student_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_student" ADD CONSTRAINT "schedule_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_category" ADD CONSTRAINT "post_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_target" ADD CONSTRAINT "notification_target_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_target" ADD CONSTRAINT "notification_target_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_stats" ADD CONSTRAINT "tutor_stats_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_stats" ADD CONSTRAINT "course_stats_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
