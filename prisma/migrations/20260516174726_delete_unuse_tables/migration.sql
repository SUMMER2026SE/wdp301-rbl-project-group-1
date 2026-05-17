/*
  Warnings:

  - You are about to drop the `activity_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation_participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_similarity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutor_similarity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutor_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_course_recommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_subject_interest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_tutor_recommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_log" DROP CONSTRAINT "activity_log_user_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_participant" DROP CONSTRAINT "conversation_participant_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_participant" DROP CONSTRAINT "conversation_participant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "course_stats" DROP CONSTRAINT "course_stats_course_id_fkey";

-- DropForeignKey
ALTER TABLE "interaction" DROP CONSTRAINT "interaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "tutor_stats" DROP CONSTRAINT "tutor_stats_tutor_id_fkey";

-- DropForeignKey
ALTER TABLE "user_subject_interest" DROP CONSTRAINT "user_subject_interest_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "user_subject_interest" DROP CONSTRAINT "user_subject_interest_user_id_fkey";

-- DropTable
DROP TABLE "activity_log";

-- DropTable
DROP TABLE "conversation";

-- DropTable
DROP TABLE "conversation_participant";

-- DropTable
DROP TABLE "course_similarity";

-- DropTable
DROP TABLE "course_stats";

-- DropTable
DROP TABLE "interaction";

-- DropTable
DROP TABLE "message";

-- DropTable
DROP TABLE "system_stats";

-- DropTable
DROP TABLE "tutor_similarity";

-- DropTable
DROP TABLE "tutor_stats";

-- DropTable
DROP TABLE "user_course_recommendation";

-- DropTable
DROP TABLE "user_subject_interest";

-- DropTable
DROP TABLE "user_tutor_recommendation";

-- DropEnum
DROP TYPE "InteractionEntityType";

-- DropEnum
DROP TYPE "InteractionEventType";
