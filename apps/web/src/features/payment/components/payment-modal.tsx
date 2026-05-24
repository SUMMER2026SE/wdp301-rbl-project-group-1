"use client";

import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { useEnrollCourseMutation } from "@/src/features/enrollment/enrollmentApi";
import { cn } from "@/src/shared/lib/utils";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface PaymentModalProps {
  trigger?: ReactNode;
  courseId: string;
  courseTitle: string;
  courseSubject: string;
  tutorName: string;
  price: number;
}

type Step = "confirm" | "loading" | "error";

const formatVnd = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

const PaymentModal = ({
  trigger,
  courseId,
  courseTitle,
  courseSubject,
  tutorName,
  price,
}: PaymentModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("confirm");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [enrollCourse] = useEnrollCourseMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStep("confirm");
      setErrorMsg("");
    }
  };

  const handleProceed = async () => {
    setStep("loading");
    setErrorMsg("");

    try {
      // Bước 1: Tạo Enrollment PENDING
      const enrollResult = await enrollCourse({
        enrollCourseDto: { courseId },
      }).unwrap();

      const { id: enrollmentId, status } = enrollResult.data;

      if (status === "ACTIVE") {
        router.push("/student/my-courses");
        return;
      }

      // Chuyển sang trang checkout với context đầy đủ qua search params
      const params = new URLSearchParams({
        enrollmentId,
        amount: String(price),
        courseTitle,
        courseSubject,
        tutorName,
      });
      router.push(`/payment/checkout?${params.toString()}`);
      setOpen(false);
    } catch (err: unknown) {
      // 409 = enrollment đã ACTIVE → vào học luôn
      const status =
        err && typeof err === "object" && "status" in err
          ? (err as { status: number }).status
          : null;
      if (status === 409) {
        router.push("/student/my-courses");
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
          : "Đã có lỗi xảy ra, vui lòng thử lại.";
      setErrorMsg(msg);
      setStep("error");
    }
  };

  const isLoading = step === "loading";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Xác nhận đăng ký</DialogTitle>
          <DialogDescription>
            Xem lại thông tin khóa học trước khi tiến hành thanh toán.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Course info card */}
          <Card className="bg-muted/50 border-border shadow-none">
            <CardContent className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {courseSubject.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col justify-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="w-fit text-[10px] uppercase tracking-wide"
                >
                  {courseSubject}
                </Badge>
                <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                  {courseTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Gia sư:{" "}
                  <span className="font-semibold text-foreground">
                    {tutorName}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Price row */}
          <div className="flex justify-between items-center px-1 py-2 border-t border-border">
            <span className="text-sm text-muted-foreground font-medium">
              Học phí
            </span>
            <span
              className={cn(
                "text-xl font-bold text-primary",
              )}
            >
              {formatVnd(price)}
            </span>
          </div>

          {/* Error state */}
          {step === "error" && errorMsg && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription className="text-sm">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          {/* Info hint */}
          {step === "confirm" && (
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Tiếp theo bạn sẽ chọn phương thức thanh toán phù hợp.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Để sau
          </Button>
          <Button
            type="button"
            onClick={handleProceed}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                Chọn thanh toán
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
