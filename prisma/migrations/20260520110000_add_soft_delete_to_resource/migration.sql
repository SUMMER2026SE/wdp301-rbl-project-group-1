ALTER TABLE "resource"
ADD COLUMN "deleted_at" TIMESTAMP(3);

CREATE INDEX "resource_deleted_at_idx" ON "resource"("deleted_at");
