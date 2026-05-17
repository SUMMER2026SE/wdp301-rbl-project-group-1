-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_payer_user_id_fkey" FOREIGN KEY ("payer_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
