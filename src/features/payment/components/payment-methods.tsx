"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import { usePaymentControllerCreatePaymentMutation } from "@/src/features/payment/paymentApi";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { BankTransferDetails } from "./bank-transfer-details";
import { PaymentMethodItem } from "./payment-method-item";

type PaymentMethodId = "payos";

interface PaymentMethodsProps {
  enrollmentId: string;
  amount: number;
}

export const PaymentMethods = ({ enrollmentId, amount }: PaymentMethodsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("payos");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [createPayment, { isLoading }] =
    usePaymentControllerCreatePaymentMutation();

  const handleCompletePayment = async () => {
    setErrorMsg("");
    try {
      const origin = window.location.origin;
      const result = (await createPayment({
        createPaymentDto: {
          referenceType: "COURSE_ENROLLMENT",
          referenceId: enrollmentId,
          amount,
          returnUrl: `${origin}/payment/success`,
          cancelUrl: window.location.href, // Quay về trang checkout để thử lại
        },
      }).unwrap()) as { checkoutUrl: string };

      // Redirect sang cổng thanh toán (PayOS hoặc Mock tuỳ env)
      window.location.href = result.checkoutUrl;
    } catch (err: unknown) {
      // 409 = enrollment đã ACTIVE (thanh toán trước đó thành công)
      const httpStatus =
        err && typeof err === "object" && "status" in err
          ? (err as { status: number }).status
          : null;
      if (httpStatus === 409) {
        window.location.href = "/student/my-courses";
        return;
      }
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Không thể tạo link thanh toán, vui lòng thử lại.";
      setErrorMsg(msg);
    }
  };

  return (
    <section className="lg:col-span-7 space-y-6">
      <Card className="bg-background p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
          Phương thức thanh toán
        </h2>

        <div className="space-y-4">
          {/* PayOS — Bank Transfer via QR */}
          <PaymentMethodItem
            selected={selectedMethod === "payos"}
            onClick={() => setSelectedMethod("payos")}
            icon="account_balance"
            title="Chuyển khoản ngân hàng (PayOS)"
            subtitle="Xác nhận tức thì qua quét mã QR"
          >
            <BankTransferDetails />
          </PaymentMethodItem>
        </div>

        {/* Error */}
        {errorMsg && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-sm">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Bằng cách nhấn &quot;Hoàn tất thanh toán&quot;, bạn đồng ý với{" "}
            <a
              href="#"
              className="text-primary hover:underline hover:decoration-primary/30"
            >
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a
              href="#"
              className="text-primary hover:underline hover:decoration-primary/30"
            >
              Chính sách hoàn tiền
            </a>
            .
          </p>
          <Button
            size="lg"
            className="w-full text-base py-6 h-auto font-bold gap-2"
            onClick={handleCompletePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Đang tạo link thanh toán...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
                Hoàn tất thanh toán
              </>
            )}
          </Button>
        </div>
      </Card>
    </section>
  );
};
