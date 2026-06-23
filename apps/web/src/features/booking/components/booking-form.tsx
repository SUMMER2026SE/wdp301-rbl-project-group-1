"use client";

import React, { useState, useMemo, useRef } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";

import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { ScheduleCalendar } from "@/src/features/student/schedule/components";
import { CheckCircle, Send, Loader2 } from "lucide-react";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Button } from "@/src/shared/components/ui/button";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { toast } from "sonner";
import {
  useCreateDirectBookingMutation,
  useGetMySessionsQuery,
  useGetTutorPublicSessionsQuery,
} from "../bookingApi";
import { useGetAllSubjectsQuery, useGetAllGradesQuery } from "@/src/features/academic-catalog/academicCatalogApi";
import { mapSessionsToScheduleClasses } from "@/src/features/schedule/utils/session-mapper";
import { useGetScheduleAvailabilityQuery } from "@/src/features/schedule/scheduleAvailabilityApi";
import { mapApiToSlots } from "@/src/features/schedule/utils/schedule-mapper";

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

/** Convert FE slot map to BE scheduleRules array by grouping contiguous 30-min blocks per day */
function slotsToScheduleRules(
  slots: Record<string, boolean>
): { dayOfWeek: number; startTime: string; endTime: string }[] {
  const activeKeys = Object.keys(slots).filter((k) => slots[k]);
  if (!activeKeys.length) return [];

  const byDay: Record<number, string[]> = {};
  activeKeys.forEach((key) => {
    const [dayStr, time] = key.split("_");
    const dayIdx = parseInt(dayStr, 10);
    // Convert "0-6 Mon-Sun" UI dayIndex to BE "0=Sunday,1=Monday..."
    // UI: 0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun -> BE: Mon=1,Tue=2,...Sun=0
    const beDayOfWeek = dayIdx === 6 ? 0 : dayIdx + 1;
    if (!byDay[beDayOfWeek]) byDay[beDayOfWeek] = [];
    byDay[beDayOfWeek].push(time);
  });

  const rules: { dayOfWeek: number; startTime: string; endTime: string }[] = [];

  Object.entries(byDay).forEach(([dayStr, times]) => {
    const dayOfWeek = parseInt(dayStr, 10);
    const sortedMins = times.map(timeToMinutes).sort((a, b) => a - b);

    let start = sortedMins[0];
    let end = sortedMins[0] + 30;

    for (let i = 1; i < sortedMins.length; i++) {
      if (sortedMins[i] === end) {
        end += 30;
      } else {
        rules.push({
          dayOfWeek,
          startTime: minutesToTime(start),
          endTime: minutesToTime(end),
        });
        start = sortedMins[i];
        end = sortedMins[i] + 30;
      }
    }
    rules.push({
      dayOfWeek,
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
    });
  });

  return rules;
}

export const bookingSchema = z.object({
  subject: z.string().min(1, "Vui lòng chọn môn học"),
  grade: z.string().min(1, "Vui lòng chọn trình độ/lớp"),
  goals: z.string().optional(),
  totalSessions: z.coerce.number().min(1, "Vui lòng nhập số buổi học"),
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
  tutorId: string;
  tutorName?: string;
  pricePerHour: number;
  tutorAvailableSlots?: Record<string, boolean>;
  onSuccess?: () => void;
}

const WEEKDAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

export function BookingForm({
  tutorId,
  tutorName,
  pricePerHour,
  tutorAvailableSlots = {},
  onSuccess,
}: BookingFormProps) {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);

  const [createDirectBooking, { isLoading }] = useCreateDirectBookingMutation();

  // Fetch subjects and grades
  const { data: subjectsResponse, isLoading: isLoadingSubjects } = useGetAllSubjectsQuery();
  const { data: gradesResponse, isLoading: isLoadingGrades } = useGetAllGradesQuery();

  const subjects = subjectsResponse?.data || [];
  const grades = gradesResponse?.data || [];

  // Fetch student's own schedule availability
  const { data: scheduleResponse } = useGetScheduleAvailabilityQuery();
  const studentSlots = useMemo(() => {
    return mapApiToSlots(scheduleResponse?.data?.availability || []);
  }, [scheduleResponse]);

  // Fetch sessions for displaying on the calendar
  const { data: mySessions } = useGetMySessionsQuery({});
  const { data: tutorSessions } = useGetTutorPublicSessionsQuery({ tutorId }, { skip: !tutorId });

  const mergedClasses = useMemo(() => {
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
  const intersectedSlots = useMemo(() => {
    const common: Record<string, boolean> = {};
    const hasStudentSlots = Object.values(studentSlots).some((v) => v);

    // Option A: If student has no slots defined, fallback to tutor's slots entirely.
    if (!hasStudentSlots) {
      return tutorAvailableSlots;
    }

    // Otherwise, perform intersection
    Object.keys(tutorAvailableSlots).forEach((key) => {
      if (tutorAvailableSlots[key] && studentSlots[key]) {
        common[key] = true;
      }
    });
    return common;
  }, [tutorAvailableSlots, studentSlots]);

  const handleSubmit = async (data: BookingFormValues) => {
    const scheduleRules = slotsToScheduleRules(selectedSlots);

    if (scheduleRules.length === 0) {
      toast.error("Vui lòng chọn ít nhất một buổi học");
      return;
    }

    try {
      await createDirectBooking({
        createDirectBookingDto: {
          tutorId,
          mode: "ONLINE",
          message: data.goals
            ? `Môn: ${data.subject} | Lớp: ${data.grade} | Mục tiêu: ${data.goals}`
            : `Môn: ${data.subject} | Lớp: ${data.grade}`,
          scheduleRules,
          totalSessions: data.totalSessions,
        },
      }).unwrap();

      toast.success("Đã gửi yêu cầu đặt lịch! Đang chờ gia sư xác nhận.");
      onSuccess?.();
      closeRef.current?.click();
    } catch {
      toast.error("Đặt lịch thất bại. Vui lòng thử lại.");
    }
  };

  // Group contiguous slots into sessions for summary display
  const parsedSessions = useMemo(() => {
    const activeKeys = Object.keys(selectedSlots).filter(
      (key) => selectedSlots[key]
    );
    if (activeKeys.length === 0) return [];

    const byDay: Record<number, string[]> = {};
    activeKeys.forEach((key) => {
      const [dayStr, time] = key.split("_");
      const dayIdx = parseInt(dayStr, 10);
      if (!byDay[dayIdx]) byDay[dayIdx] = [];
      byDay[dayIdx].push(time);
    });

    const sessions: { dayIndex: number; start: string; end: string }[] = [];

    Object.keys(byDay).forEach((dayIdxStr) => {
      const dayIdx = parseInt(dayIdxStr, 10);
      const times = byDay[dayIdx];
      const sortedMins = times.map(timeToMinutes).sort((a, b) => a - b);

      let currentSessionStart = sortedMins[0];
      let currentSessionEnd = sortedMins[0] + 30;

      for (let i = 1; i < sortedMins.length; i++) {
        const time = sortedMins[i];
        if (time === currentSessionEnd) {
          currentSessionEnd = time + 30;
        } else {
          sessions.push({
            dayIndex: dayIdx,
            start: minutesToTime(currentSessionStart),
            end: minutesToTime(currentSessionEnd),
          });
          currentSessionStart = time;
          currentSessionEnd = time + 30;
        }
      }
      sessions.push({
        dayIndex: dayIdx,
        start: minutesToTime(currentSessionStart),
        end: minutesToTime(currentSessionEnd),
      });
    });

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
          // @ts-expect-error: zodResolver inference issue with z.coerce.number()
          resolver={zodResolver(bookingSchema)}
          defaultValues={{
            subject: "",
            grade: "",
            goals: "",
            totalSessions: 0,
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
                placeholder={isLoadingSubjects ? "Đang tải..." : "Chọn môn học"}
                options={subjects.map((s) => ({ label: s.name, value: s.name }))}
                disabled={isLoadingSubjects}
              />
              <SelectBox
                id="grade"
                name="grade"
                label="Lớp"
                placeholder={isLoadingGrades ? "Đang tải..." : "Chọn trình độ"}
                options={grades.map((g) => ({ label: g.name, value: g.name }))}
                disabled={isLoadingGrades}
              />
              <TextBox
                id="totalSessions"
                name="totalSessions"
                label="Tổng số buổi học *"
                type="number"
                placeholder="Ví dụ: 10"
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
              <div className="space-y-1.5 flex flex-col">
                <label htmlFor="price" className="text-sm font-medium">
                  Giá / giờ của {tutorName ?? "gia sư"} (VND)
                </label>
                <input
                  id="price"
                  type="text"
                  value={pricePerHour.toLocaleString("vi-VN")}
                  disabled
                  className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-bold text-primary bg-muted/50"
                />
              </div>
            </div>
          </section>

          {/* Summary */}
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
                <span>Giá: {pricePerHour.toLocaleString("vi-VN")}đ / giờ</span>
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
            form="booking-form"
            disabled={isLoading}
            className="flex-1 sm:flex-none h-11 px-10 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 flex items-center justify-center gap-2"
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
