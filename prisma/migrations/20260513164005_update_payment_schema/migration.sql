/*
  Warnings:

  - You are about to drop the column `course_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_code]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payer_user_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_type` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "payment_reference_type" AS ENUM ('COURSE_ENROLLMENT');

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_student_id_fkey";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "course_id",
DROP COLUMN "student_id",
ADD COLUMN     "checkout_url" TEXT,
ADD COLUMN     "order_code" SERIAL NOT NULL,
ADD COLUMN     "payer_user_id" TEXT NOT NULL,
ADD COLUMN     "reference_id" TEXT NOT NULL,
ADD COLUMN     "reference_type" "payment_reference_type" NOT NULL,
ADD COLUMN     "transaction_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tutor_application" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "files" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_code_key" ON "payment"("order_code");
