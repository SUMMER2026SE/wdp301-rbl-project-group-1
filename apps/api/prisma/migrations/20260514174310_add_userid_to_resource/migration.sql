/*
  Warnings:

  - Added the required column `user_id` to the `resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resource" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "resource_user_id_idx" ON "resource"("user_id");

-- AddForeignKey
ALTER TABLE "resource" ADD CONSTRAINT "resource_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
