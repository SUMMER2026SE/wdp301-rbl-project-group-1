-- CreateEnum
CREATE TYPE "auth_provider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateTable
CREATE TABLE "user_identity" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "auth_provider" NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "email" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_identity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_identity_provider_email_idx" ON "user_identity"("provider", "email");

-- CreateIndex
CREATE UNIQUE INDEX "user_identity_provider_provider_user_id_key" ON "user_identity"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_identity_user_id_provider_key" ON "user_identity"("user_id", "provider");

-- AddForeignKey
ALTER TABLE "user_identity" ADD CONSTRAINT "user_identity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
