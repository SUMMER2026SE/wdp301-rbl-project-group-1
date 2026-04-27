-- CreateEnum
CREATE TYPE "tutor_application_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "tutor_application" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "specialization" TEXT NOT NULL,
    "experience" INTEGER,
    "education" TEXT,
    "price_per_hour" DOUBLE PRECISION,
    "status" "tutor_application_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tutor_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutor_application_user_id_key" ON "tutor_application"("user_id");

-- CreateIndex
CREATE INDEX "tutor_application_status_idx" ON "tutor_application"("status");

-- CreateIndex
CREATE INDEX "tutor_application_created_at_idx" ON "tutor_application"("created_at");

-- AddForeignKey
ALTER TABLE "tutor_application" ADD CONSTRAINT "tutor_application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;