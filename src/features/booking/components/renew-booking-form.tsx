"use client";

import React, { useRef, useState } from "react";
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
import {
  useRenewBookingMutation,
  useGetMySessionsQuery,
  useGetTutorPublicSessionsQuery,
} from "../bookingApi";
import { useGetTutorByIdQuery } from "@/src/features/student/tutors/tutorEnhance";
import { ScheduleCalendar } from "@/src/features/student/schedule/components";
import { useGetScheduleAvailabilityQuery } from "@/src/features/schedule/scheduleAvailabilityApi";
import { mapApiToSlots, mapSlotsToApi } from "@/src/features/schedule/utils/schedule-mapper";
import { mapSessionsToScheduleClasses } from "@/src/features/schedule/utils/session-mapper";
import { CheckCircle } from "lucide-react";

export const renewBookingSchema = z.object({
  totalSessions: z.coerce.number().min(1, "Vui lòng nhập số buổi học"),
  message: z.string().optional(),
  slots: z.record(z.string(), z.boolean()).optional(),
});

export type RenewBookingFormValues = z.infer<typeof renewBookingSchema>;

interface RenewBookingFormProps {
  bookingId: string;
  tutorId?: string;
  tutorName: string;
  pricePerHour: number;
  tutorAvailableSlots?: Record<string, boolean>;
  onSuccess?: () => void;
}

export function RenewBookingForm({
  bookingId,
  tutorId,
  tutorName,
  pricePerHour,
  tutorAvailableSlots = {},
  onSuccess,
}: RenewBookingFormProps) {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const [renewBooking, { isLoading }] = useRenewBookingMutation();

  // Fetch tutor availability if not provided
  const { data: tutorData } = useGetTutorByIdQuery(
    { id: tutorId || "" },
    { skip: !tutorId || Object.keys(tutorAvailableSlots).length > 0 }
  );

  const effectiveTutorAvailableSlots = React.useMemo(() => {
    if (Object.keys(tutorAvailableSlots).length > 0) return tutorAvailableSlots;
    if (tutorData?.data?.availability) {
      return mapApiToSlots(tutorData.data.availability);
    }
    return {};
  }, [tutorAvailableSlots, tutorData]);

  // Fetch student's own schedule availability
  const { data: scheduleResponse } = useGetScheduleAvailabilityQuery();
  const studentSlots = React.useMemo(() => {
    return mapApiToSlots(scheduleResponse?.data?.availability || []);
  }, [scheduleResponse]);

  // Fetch sessions for displaying on the calendar
  const { data: mySessions } = useGetMySessionsQuery({});
  const { data: tutorSessions } = useGetTutorPublicSessionsQuery({ tutorId: tutorId || "" }, { skip: !tutorId });

  const mergedClasses = React.useMemo(() => {
    const studentClasses = mySessions?.data
      ? mapSessionsToScheduleClasses(
          mySessions.data.filter((s) => !s.isRescheduled)
        ).map((c) => ({
          ...c,
          name: `[Bạn] ${c.name}`,
        }))
      : [];

    const studentClassIds = new Set(studentClasses.map((c) => c.id));

    const tutorClassesList = tutorSessions?.data
      ? mapSessionsToScheduleClasses(
          tutorSessions.data.filter((s) => !s.isRescheduled)
        )
          .filter((c) => !studentClassIds.has(c.id))
          .map((c) => ({
            ...c,
            name: `[Gia sư] ${c.name}`,
          }))
      : [];

    const finalStudentClasses = studentClasses.map((c) => {
      const isShared = tutorSessions?.data?.some((ts) => ts.id === c.id);
      if (isShared) {
        return { ...c, name: c.name.replace("[Bạn]", "[Chung]") };
      }
      return c;
    });

    return [...finalStudentClasses, ...tutorClassesList];
  }, [mySessions, tutorSessions]);

  // Compute intersected slots between tutor and student
  const intersectedSlots = React.useMemo(() => {
    const common: Record<string, boolean> = {};
    const hasStudentSlots = Object.values(studentSlots).some((v) => v);

    if (!hasStudentSlots) {
      return effectiveTutorAvailableSlots;
    }

    Object.keys(effectiveTutorAvailableSlots).forEach((key) => {
      if (effectiveTutorAvailableSlots[key] && studentSlots[key]) {
        common[key] = true;
      }
    });
    return common;
  }, [effectiveTutorAvailableSlots, studentSlots]);

  const handleSubmit = async (data: RenewBookingFormValues) => {
    const scheduleRules = selectedSlots && Object.values(selectedSlots).some(v => v) 
      ? mapSlotsToApi(selectedSlots) 
      : undefined;

    try {
      await renewBooking({
        id: bookingId,
        renewBookingDto: {
          totalSessions: data.totalSessions,
          message: data.message,
          scheduleRules,
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
      <div className="flex-1 overflow-y-auto max-h-[75vh] p-6 space-y-6 hide-scrollbar">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3 text-sm text-primary shrink-0">
          <Info className="size-5 shrink-0 mt-0.5" />
          <p>
            Bạn đang yêu cầu gia hạn khóa học với gia sư <strong>{tutorName}</strong>. 
            Nếu không chọn lịch học mới, lịch học các tuần tiếp theo sẽ được giữ nguyên theo khóa học cũ.
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
          <section className="space-y-4 shrink-0">
            <TextBox
              id="totalSessions"
              name="totalSessions"
              label="Số buổi học muốn gia hạn *"
              type="number"
              placeholder="Ví dụ: 10"
            />
          </section>

          {/* Weekly Schedule (Optional) */}
          <section className="space-y-4 shrink-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-foreground uppercase tracking-wider text-xs">
                Lịch trống trong tuần (Tùy chọn)
              </h3>
              <span className="text-[10px] text-primary font-bold">CHỌN NẾU MUỐN ĐỔI LỊCH MỚI</span>
            </div>
            <div className="border border-border rounded-lg overflow-x-auto bg-background">
              <div className="min-w-[800px]">
                <FormField<RenewBookingFormValues, "slots">
                  name="slots"
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper error={fieldState.error?.message}>
                      <ScheduleCalendar
                        mode="fixed"
                        variant="booking"
                        tutorAvailableSlots={intersectedSlots}
                        initialAvailableSlots={selectedSlots}
                        onAvailableSlotsChange={(slots) => {
                          setSelectedSlots(slots);
                          field.onChange(slots);
                        }}
                        classes={mergedClasses}
                        selectedFilter="all"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 shrink-0">
            
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

          {/* Summary */}
          <div className="bg-secondary p-5 rounded-xl text-secondary-foreground shadow-md space-y-4 shrink-0">
            <h4 className="font-bold text-sm">Tóm tắt yêu cầu gia hạn</h4>
            <ul className="space-y-2.5 opacity-90 text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 mt-0.5 shrink-0" />
                <span>
                  Lịch học: {Object.values(selectedSlots).some(v => v) ? "Sử dụng lịch mới" : "Sử dụng lịch cũ"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 mt-0.5 shrink-0" />
                <span>Giá: {pricePerHour.toLocaleString("vi-VN")}đ / giờ</span>
              </li>
            </ul>
          </div>
        </InputForm>
      </div>

      <div className="px-6 py-4 border-t border-border bg-card flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-0 w-full">
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
