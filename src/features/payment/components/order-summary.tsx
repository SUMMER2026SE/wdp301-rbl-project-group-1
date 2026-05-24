"use client";

import { Card } from "@/src/shared/components/ui/card";

interface OrderSummaryProps {
  courseTitle: string;
  courseSubject: string;
  tutorName: string;
  amount: number;
}

const formatVnd = (amount: number) => amount.toLocaleString("vi-VN") + "đ";

export const OrderSummary = ({
  courseTitle,
  courseSubject,
  tutorName,
  amount,
}: OrderSummaryProps) => {
  return (
    <aside className="lg:col-span-5 space-y-6">
      <Card className="bg-muted/50 border-border shadow-sm p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
          Tóm tắt đơn hàng
        </h2>

        {/* Course info */}
        <div className="flex gap-4 mb-6">
          <div className="w-20 h-20 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {courseSubject.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-1">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
              {courseSubject}
            </h3>
            <p className="text-sm font-bold text-foreground leading-tight">
              {courseTitle}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                person
              </span>
              Gia sư: {tutorName}
            </p>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 pt-6 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Học phí</span>
            <span className="text-foreground text-sm font-medium">
              {formatVnd(amount)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t-2 border-primary border-dashed">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-foreground font-heading">
              Tổng cộng
            </span>
            <span className="text-2xl font-bold text-primary font-heading">
              {formatVnd(amount)}
            </span>
          </div>
        </div>
      </Card>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-4 py-4 bg-muted/30 rounded-lg border border-border">
        <span className="material-symbols-outlined text-primary">
          verified_user
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          Thanh toán được mã hóa SSL
        </span>
      </div>
    </aside>
  );
};
