import { Button } from "@/src/shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex-grow w-full flex items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="size-12 text-emerald-500" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground font-heading">
            Thanh toán thành công!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Giao dịch của bạn đã được xác nhận. Khóa học đã được kích hoạt và
            sẵn sàng để học.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-border" />

        {/* Info */}
        <div className="flex items-start gap-3 bg-muted/50 rounded-lg border border-border p-4 text-sm text-muted-foreground text-left">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
            info
          </span>
          <span>
            Nếu khóa học chưa hiển thị ngay, hãy đợi vài giây và làm mới
            trang. Webhook xác nhận thanh toán có thể mất một chút thời gian để
            xử lý.
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button asChild className="flex-1" size="lg">
            <Link href="/student/my-courses">Vào học ngay</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" size="lg">
            <Link href="/student/courses">Khám phá khóa học</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
