"use client";

import React, { useState, useMemo } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { ScheduleCalendar } from "@/src/features/student/schedule/components";
import { CheckCircle, Send } from "lucide-react";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Button } from "@/src/shared/components/ui/button";
import { DialogClose } from "@/src/shared/components/ui/dialog";

// MOCK data (should be passed down via props later)
const MOCK_TUTOR = {
  name: "ThS. Nguyễn An",
  pricePerHour: 350000,
};

// Helper to parse time string "HH:mm" to minutes
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Helper to format minutes to "HH:mm"
const minutesToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export const bookingSchema = z.object({
  subject: z.string().min(1, "Vui lòng chọn môn học"),
  grade: z.string().min(1, "Vui lòng chọn trình độ/lớp"),
  goals: z.string().optional(),
  slots: z.record(z.string(), z.boolean()).superRefine((slots, ctx) => {
    const activeKeys = Object.keys(slots).filter((key) => slots[key]);
    if (activeKeys.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vui lòng chọn lịch học",
      });
      return;
    }

    // Group by dayIndex
    const byDay: Record<number, string[]> = {};
    activeKeys.forEach((key) => {
      const [dayStr, time] = key.split("_");
      const dayIdx = parseInt(dayStr, 10);
      if (!byDay[dayIdx]) byDay[dayIdx] = [];
      byDay[dayIdx].push(time);
    });

    let hasInvalidSession = false;

    Object.keys(byDay).forEach((dayIdxStr) => {
      const times = byDay[parseInt(dayIdxStr, 10)];
      const sortedMins = times.map(timeToMinutes).sort((a, b) => a - b);
      
      let currentSessionLength = 1;
      let currentSessionEnd = sortedMins[0] + 30;

      for (let i = 1; i < sortedMins.length; i++) {
        const time = sortedMins[i];
        if (time === currentSessionEnd) {
          currentSessionLength++;
          currentSessionEnd = time + 30;
        } else {
          if (currentSessionLength < 3) {
            hasInvalidSession = true;
          }
          currentSessionLength = 1;
          currentSessionEnd = time + 30;
        }
      }
      if (currentSessionLength < 3) {
        hasInvalidSession = true;
      }
    });

    if (hasInvalidSession) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mỗi buổi học phải kéo dài ít nhất 1.5 giờ (3 ô liên tục)",
      });
    }
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSuccess?: () => void;
}

const WEEKDAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});

  // Mock tutor available slots: Monday & Tuesday morning
  const [tutorAvailableSlots] = useState<Record<string, boolean>>({
    "0_07:00": true,
    "0_07:30": true,
    "0_08:00": true,
    "0_08:30": true,
    "1_08:00": true,
    "1_08:30": true,
    "1_09:00": true,
    "1_09:30": true,
    "1_10:00": true,
    "1_10:30": true,
  });

  const handleSubmit = (data: BookingFormValues) => {
    console.log("Submit booking:", { ...data, slots: selectedSlots });
    if (onSuccess) onSuccess();
    // TODO: integrate API
  };

  // Group contiguous slots into sessions
  const parsedSessions = useMemo(() => {
    const activeKeys = Object.keys(selectedSlots).filter((key) => selectedSlots[key]);
    if (activeKeys.length === 0) return [];

    // Group by dayIndex
    const byDay: Record<number, string[]> = {};
    activeKeys.forEach((key) => {
      const [dayStr, time] = key.split("_");
      const dayIdx = parseInt(dayStr, 10);
      if (!byDay[dayIdx]) byDay[dayIdx] = [];
      byDay[dayIdx].push(time);
    });

    const sessions: { dayIndex: number; start: string; end: string }[] = [];

    // Parse each day
    Object.keys(byDay).forEach((dayIdxStr) => {
      const dayIdx = parseInt(dayIdxStr, 10);
      const times = byDay[dayIdx];
      
      // Sort times by minutes
      const sortedMins = times.map(timeToMinutes).sort((a, b) => a - b);

      let currentSessionStart = sortedMins[0];
      let currentSessionEnd = sortedMins[0] + 30; // each slot is 30 mins

      for (let i = 1; i < sortedMins.length; i++) {
        const time = sortedMins[i];
        if (time === currentSessionEnd) {
          // contiguous
          currentSessionEnd = time + 30;
        } else {
          // gap found, push previous session and start new
          sessions.push({
            dayIndex: dayIdx,
            start: minutesToTime(currentSessionStart),
            end: minutesToTime(currentSessionEnd),
          });
          currentSessionStart = time;
          currentSessionEnd = time + 30;
        }
      }
      // push last session
      sessions.push({
        dayIndex: dayIdx,
        start: minutesToTime(currentSessionStart),
        end: minutesToTime(currentSessionEnd),
      });
    });

    // Sort sessions by day then start time
    sessions.sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
      return timeToMinutes(a.start) - timeToMinutes(b.start);
    });

    return sessions;
  }, [selectedSlots]);

  const totalSessionsCount = parsedSessions.length;

  return (
    <>
      <div className="flex-1 overflow-y-auto max-h-[75vh] p-6 space-y-8 hide-scrollbar">
        <InputForm<BookingFormValues>
          id="booking-form"
          mode="onChange"
          resolver={zodResolver(bookingSchema)}
          defaultValues={{
            subject: "",
            grade: "",
            goals: "",
            slots: {},
          }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Subject & Grade */}
          <section className="space-y-4">
            <h3 className="font-medium text-foreground uppercase tracking-wider text-xs">
              Môn học & Trình độ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectBox
                id="subject"
                name="subject"
                label="Môn học"
                placeholder="Chọn môn học"
                options={[
                  { label: "Tiếng Anh", value: "english" },
                  { label: "Toán học", value: "math" },
                  { label: "Vật lý", value: "physics" },
                  { label: "Hóa học", value: "chemistry" },
                ]}
              />
              <SelectBox
                id="grade"
                name="grade"
                label="Lớp"
                placeholder="Chọn trình độ"
                options={[
                  { label: "Lớp 10", value: "10" },
                  { label: "Lớp 11", value: "11" },
                  { label: "Lớp 12", value: "12" },
                  { label: "Luyện thi Đại học", value: "uni" },
                ]}
              />
            </div>
          </section>

          {/* Weekly Schedule */}
          <section className="space-y-4 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-foreground uppercase tracking-wider text-xs">
                Lịch trống trong tuần
              </h3>
              <span className="text-[10px] text-primary font-bold">CHỌN Ô ĐỂ ĐĂNG KÝ</span>
            </div>
            <div className="border border-border rounded-lg overflow-x-auto bg-background">
              <div className="min-w-[800px]">
                <FormField<BookingFormValues, "slots">
                  name="slots"
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper error={fieldState.error?.message}>
                      <ScheduleCalendar
                        mode="fixed"
                        variant="booking"
                        tutorAvailableSlots={tutorAvailableSlots}
                        initialAvailableSlots={selectedSlots}
                        onAvailableSlotsChange={(slots) => {
                          setSelectedSlots(slots);
                          field.onChange(slots);
                        }}
                        classes={[]}
                        selectedFilter="all"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>
          </section>

          {/* Learning Goals */}
          <section className="space-y-3">
            <h3 className="font-medium text-foreground uppercase tracking-wider text-xs">
              Mục tiêu & Yêu cầu
            </h3>
            <FormField<BookingFormValues, "goals">
              name="goals"
              render={({ field, fieldState }) => (
                <FormFieldWrapper error={fieldState.error?.message}>
                  <Textarea
                    {...field}
                    placeholder="Ví dụ: Lấy lại căn bản tiếng Anh, luyện thi IELTS Speaking..."
                    className="min-h-[100px] resize-none"
                  />
                </FormFieldWrapper>
              )}
            />
          </section>

          {/* Proposed Pricing */}
          <section className="space-y-4">
            <h3 className="font-medium text-foreground uppercase tracking-wider text-xs">
              Chi phí đề xuất
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <TextBox
                  id="price"
                  name="price"
                  label="Giá / giờ (VND)"
                  value={MOCK_TUTOR.pricePerHour.toLocaleString("vi-VN")}
                  disabled
                  inputClassName="font-bold text-primary bg-muted/50"
                />
              </div>
            </div>
          </section>

          {/* Summary Integration */}
          <div className="bg-secondary p-5 rounded-xl text-secondary-foreground shadow-md space-y-4">
            <h4 className="font-bold text-sm">Tóm tắt yêu cầu</h4>
            <ul className="space-y-2.5 opacity-90 text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 mt-0.5 shrink-0" />
                <span>
                  Lịch: {totalSessionsCount > 0 ? `${totalSessionsCount} buổi đã chọn` : "Chưa chọn lịch"}
                </span>
              </li>
              <AnimatePresence>
                {parsedSessions.length > 0 && (
                  <motion.li 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1.5 pl-6 mt-1 overflow-hidden"
                  >
                    <AnimatePresence mode="popLayout">
                      {parsedSessions.map((session) => (
                        <motion.div 
                          key={`${session.dayIndex}-${session.start}-${session.end}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          layout
                          className="text-muted-foreground"
                        >
                          • {WEEKDAYS[session.dayIndex]}: {session.start} - {session.end}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.li>
                )}
              </AnimatePresence>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 mt-0.5 shrink-0" />
                <span>Giá: {MOCK_TUTOR.pricePerHour.toLocaleString("vi-VN")}đ / giờ</span>
              </li>
            </ul>
          </div>
        </InputForm>
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-border bg-card flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-0 w-full">
        <p className="text-[10px] text-muted-foreground italic text-center sm:text-left">
          Gia sư sẽ phản hồi yêu cầu của bạn trong vòng 24h.
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1 sm:flex-none h-11 px-6 rounded-xl">
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="booking-form"
            className="flex-1 sm:flex-none h-11 px-10 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 flex items-center justify-center gap-2"
          >
            Gửi yêu cầu
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
