/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `tutor_application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `tutor_application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutor_application" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tutor_application_email_key" ON "tutor_application"("email");
