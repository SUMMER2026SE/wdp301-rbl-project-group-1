"use client";

import React, { useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { Send, Loader2, Info } from "lucide-react";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Button } from "@/src/shared/components/ui/button";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { toast } from "sonner";
import { useRenewBookingMutation } from "../bookingApi";

export const renewBookingSchema = z.object({
  totalSessions: z.coerce.number().min(1, "Vui lòng nhập số buổi học"),
  message: z.string().optional(),
});

export type RenewBookingFormValues = z.infer<typeof renewBookingSchema>;

interface RenewBookingFormProps {
  bookingId: string;
  tutorName: string;
  pricePerHour: number;
  onSuccess?: () => void;
}

export function RenewBookingForm({
  bookingId,
  tutorName,
  pricePerHour,
  onSuccess,
}: RenewBookingFormProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [renewBooking, { isLoading }] = useRenewBookingMutation();

  const handleSubmit = async (data: RenewBookingFormValues) => {
    try {
      await renewBooking({
        id: bookingId,
        renewBookingDto: {
          totalSessions: data.totalSessions,
          message: data.message,
        },
      }).unwrap();

      toast.success("Đã gửi yêu cầu gia hạn! Đang chờ gia sư xác nhận.");
      onSuccess?.();
      closeRef.current?.click();
    } catch {
      toast.error("Gia hạn thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="flex-1 p-6 space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3 text-sm text-primary">
          <Info className="size-5 shrink-0 mt-0.5" />
          <p>
            Bạn đang yêu cầu gia hạn khóa học với gia sư <strong>{tutorName}</strong>. Lịch học các tuần tiếp theo sẽ được giữ nguyên theo khóa học cũ. Bạn có thể thoả thuận lại lịch với gia sư qua phần chat nếu cần.
          </p>
        </div>

        <InputForm<RenewBookingFormValues>
          id="renew-booking-form"
          mode="onChange"
          // @ts-expect-error: zodResolver inference issue
          resolver={zodResolver(renewBookingSchema)}
          defaultValues={{
            totalSessions: 0,
            message: "",
          }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <section className="space-y-4">
            <TextBox
              id="totalSessions"
              name="totalSessions"
              label="Số buổi học muốn gia hạn *"
              type="number"
              placeholder="Ví dụ: 10"
            />
            
            <FormField<RenewBookingFormValues, "message">
              name="message"
              render={({ field, fieldState }) => (
                <FormFieldWrapper error={fieldState.error?.message}>
                  <label className="text-sm font-medium mb-1.5 block text-foreground">
                    Lời nhắn (Tùy chọn)
                  </label>
                  <Textarea
                    {...field}
                    placeholder="Nhập lời nhắn đến gia sư..."
                    className="min-h-[100px] resize-none"
                  />
                </FormFieldWrapper>
              )}
            />

            <div className="space-y-1.5 flex flex-col pt-2">
              <label htmlFor="price" className="text-sm font-medium">
                Giá hiện tại / giờ (VND)
              </label>
              <input
                id="price"
                type="text"
                value={pricePerHour.toLocaleString("vi-VN")}
                disabled
                className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm disabled:opacity-50 font-bold text-primary bg-muted/50 cursor-not-allowed"
              />
            </div>
          </section>
        </InputForm>
      </div>

      <div className="px-6 py-4 border-t border-border bg-card flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="text-[10px] text-muted-foreground italic text-center sm:text-left">
          Gia sư sẽ phản hồi yêu cầu của bạn trong vòng 24h.
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <DialogClose asChild>
            <Button
              ref={closeRef}
              variant="outline"
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="renew-booking-form"
            disabled={isLoading}
            className="flex-1 sm:flex-none h-11 px-8 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Gửi yêu cầu
                <Send className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
