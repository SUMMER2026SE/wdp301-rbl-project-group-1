"use client";

import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CalendarDays, Clock, AlertCircle } from "lucide-react";

import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import { FormFieldWrapper } from "@/src/shared/components/molecules/form-field/form-field-wrapper";
import FormField from "@/src/shared/components/molecules/form-field/form-field";
import { Textarea } from "@/src/shared/components/ui/textarea";

import { ScheduleCalendar } from "@/src/shared/components/organisms/schedule-calendar/schedule-calendar";
import { useGetAllSubjectsQuery } from "@/src/features/academic-catalog/academicCatalogApi";
import { useCreateTutorRequestMutation } from "../../tutor-request/tutorRequestEnhance";
import {
  useGetScheduleAvailabilityQuery,
} from "@/src/features/schedule/scheduleAvailabilityEnhance";
import { mapApiToSlots, mapSlotsToApi } from "@/src/features/schedule/utils/schedule-mapper";

// ─── Schema ──────────────────────────────────────────────────────────────────

const createTutorRequestSchema = z.object({
  title: z.string().min(5, "Tiêu đề cần ít nhất 5 ký tự"),
  description: z.string().min(10, "Mô tả cần ít nhất 10 ký tự"),
  subjectId: z.string().optional(),
  mode: z.enum(["ONLINE", "AT_HOME"], { message: "Vui lòng chọn hình thức" }),
  budget: z.coerce
    .number()
    .optional()
    .refine((val) => !val || val >= 0, "Ngân sách không hợp lệ"),
  totalSessions: z.coerce.number().min(1, "Vui lòng nhập số buổi học"),
});

export type CreateTutorRequestFormValues = z.infer<
  typeof createTutorRequestSchema
>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateTutorRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// ─── Slot counter mini-component ─────────────────────────────────────────────

function SlotSummary({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-primary/8 border border-primary/20 text-primary text-sm font-medium">
      <Clock className="size-3.5 shrink-0" />
      <span>
        Đã chọn <strong>{count}</strong> khung giờ (~{count}h/tuần)
      </span>
    </div>
  );
}

// ─── Availability loading skeleton ───────────────────────────────────────────

function AvailabilityLoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-8 bg-muted rounded-lg w-1/3" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-5 bg-muted rounded w-full" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-8 bg-muted/60 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── No availability empty state ─────────────────────────────────────────────

function NoAvailabilityState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex items-center justify-center size-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
        <AlertCircle className="size-6 text-amber-500" />
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">
          Chưa có lịch rảnh
        </p>
        <p className="text-muted-foreground text-xs mt-1 max-w-[260px]">
          Bạn chưa thiết lập khung giờ rảnh. Hãy vào{" "}
          <strong>Lịch của tôi</strong> để cài đặt trước, hoặc chọn thủ công
          bên dưới.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateTutorRequestForm({
  onSuccess,
  onCancel,
}: CreateTutorRequestFormProps) {
  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: subjectsData, isLoading: isLoadingSubjects } =
    useGetAllSubjectsQuery();
  const {
    data: availabilityData,
    isLoading: isLoadingAvailability,
    isError: isAvailabilityError,
  } = useGetScheduleAvailabilityQuery();
  const [createRequest, { isLoading: isSubmitting }] =
    useCreateTutorRequestMutation();

  // ── Local state ────────────────────────────────────────────────────────────
  // selectedSlots: starts empty, gets pre-populated with student's own availability
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);

  // When availability data loads, pre-populate selection with student's own slots
  useEffect(() => {
    if (availabilityData?.data?.availability && !availabilityLoaded) {
      setTimeout(() => {
        const mapped = mapApiToSlots(availabilityData.data.availability);
        setSelectedSlots(mapped);
        setAvailabilityLoaded(true);
      }, 0);
    }
  }, [availabilityData, availabilityLoaded]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedCount = useMemo(
    () => Object.values(selectedSlots).filter(Boolean).length,
    [selectedSlots]
  );

  const hasMyAvailability =
    !isLoadingAvailability &&
    !isAvailabilityError &&
    availabilityLoaded &&
    Object.keys(selectedSlots).length > 0;

  const subjectOptions = useMemo(() => {
    if (!subjectsData?.data) return [];
    return subjectsData.data.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));
  }, [subjectsData]);

  const modeOptions = [
    { value: "ONLINE", label: "Học trực tuyến" },
    { value: "AT_HOME", label: "Học tại nhà" },
  ];

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectAll = () => {
    // Re-select all slots loaded from availability API
    if (availabilityData?.data?.availability) {
      const mapped = mapApiToSlots(availabilityData.data.availability);
      setSelectedSlots(mapped);
    }
  };

  const handleClearSelection = () => {
    setSelectedSlots({});
  };

  const handleSubmit = async (values: CreateTutorRequestFormValues) => {
    const scheduleRules = mapSlotsToApi(selectedSlots);

    try {
      await createRequest({
        createTutorRequestDto: {
          title: values.title,
          description: values.description,
          mode: values.mode,
          subjectId: values.subjectId || undefined,
          budget: values.budget || undefined,
          scheduleRules,
          totalSessions: values.totalSessions,
        },
      }).unwrap();

      toast.success("Tạo yêu cầu thành công!");
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Có lỗi xảy ra khi tạo yêu cầu");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex-1 overflow-y-auto max-h-[75vh] p-6 space-y-8 hide-scrollbar">
        <InputForm<CreateTutorRequestFormValues>
          id="create-tutor-request-form"
          // @ts-expect-error: zodResolver inference issue with z.coerce.number()
          resolver={zodResolver(createTutorRequestSchema)}
          onSubmit={handleSubmit}
          defaultValues={{
            title: "",
            description: "",
            mode: "ONLINE",
            budget: 0,
          } as CreateTutorRequestFormValues}
          className="flex flex-col gap-8"
        >
          {/* ── Section 1: General Info ────────────────────────────────── */}
          <section className="space-y-4">
            <SectionLabel icon={null} text="Thông tin chung" />
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5">
              <TextBox
                id="request-title"
                name="title"
                label="Tiêu đề yêu cầu *"
                placeholder="Ví dụ: Cần gia sư Toán lớp 12 ôn thi đại học"
                className="bg-muted/30 focus-within:bg-background transition-colors"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectBox
                  id="request-subject"
                  name="subjectId"
                  label="Môn học"
                  options={subjectOptions}
                  placeholder={
                    isLoadingSubjects ? "Đang tải..." : "Chọn môn học"
                  }
                  className="bg-muted/30 focus-within:bg-background transition-colors"
                />
                <SelectBox
                  id="request-mode"
                  name="mode"
                  label="Hình thức học *"
                  options={modeOptions}
                  placeholder="Chọn hình thức"
                  className="bg-muted/30 focus-within:bg-background transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextBox
                  id="request-budget"
                  name="budget"
                  label="Ngân sách dự kiến (VNĐ/giờ)"
                  type="number"
                  placeholder="0"
                  className="bg-muted/30 focus-within:bg-background transition-colors"
                />
                <TextBox
                  id="request-totalSessions"
                  name="totalSessions"
                  label="Tổng số buổi học *"
                  type="number"
                  placeholder="Ví dụ: 10"
                  className="bg-muted/30 focus-within:bg-background transition-colors"
                />
              </div>
            </div>
          </section>

          {/* ── Section 2: Description ────────────────────────────────── */}
          <section className="space-y-4">
            <SectionLabel icon={null} text="Chi tiết yêu cầu" />
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <FormFieldWrapper
                label="Mô tả chi tiết *"
                className="space-y-2"
              >
                <FormField
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Nêu rõ yêu cầu về gia sư, mục tiêu học tập, tài liệu hiện có..."
                      className="resize-none min-h-[120px] bg-muted/30 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring transition-colors rounded-xl p-4 text-base"
                    />
                  )}
                />
              </FormFieldWrapper>
            </div>
          </section>

          {/* ── Section 3: Availability Picker ────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <SectionLabel icon={<CalendarDays className="size-3.5" />} text="Thời gian muốn học" />
                <p className="text-xs text-muted-foreground pl-0.5">
                  {hasMyAvailability
                    ? "Lịch rảnh của bạn được hiển thị sẵn. Bạn có thể bỏ chọn những giờ không muốn dạy."
                    : "Chọn khung giờ bạn có thể học trong tuần."}
                </p>
              </div>

              {hasMyAvailability && (
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Xóa chọn
                  </button>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {isLoadingAvailability ? (
                <div className="p-6">
                  <AvailabilityLoadingSkeleton />
                </div>
              ) : !hasMyAvailability && !isAvailabilityError ? (
                <div className="p-4">
                  <NoAvailabilityState />
                  {/* Still allow manual selection */}
                  <div className="border-t border-border mt-4 pt-4">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      Hoặc chọn thủ công bên dưới
                    </p>
                    <div className="border rounded-xl bg-background overflow-hidden">
                      <ScheduleCalendar
                        mode="fixed"
                        variant="availability"
                        classes={[]}
                        selectedFilter="all"
                        classColorMap={{}}
                        getClassesForDate={() => []}
                        initialAvailableSlots={selectedSlots}
                        onAvailableSlotsChange={setSelectedSlots}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2">
                  {/* Legend */}
                  <div className="flex items-center gap-4 px-4 pt-3 pb-2">
                    <LegendItem color="bg-primary border-primary" label="Giờ rảnh (click để bỏ chọn)" />
                    <LegendItem color="bg-background border-border" label="Không chọn" />
                  </div>
                  <div className="border-t border-border/50 mt-1">
                    <ScheduleCalendar
                      key={`availability-calendar-${availabilityLoaded}`}
                      mode="fixed"
                      variant="availability"
                      classes={[]}
                      selectedFilter="all"
                      classColorMap={{}}
                      getClassesForDate={() => []}
                      initialAvailableSlots={selectedSlots}
                      onAvailableSlotsChange={setSelectedSlots}
                    />
                  </div>
                </div>
              )}

              {/* Slot count badge */}
              {selectedCount > 0 && (
                <div className="px-5 pb-4">
                  <SlotSummary count={selectedCount} />
                </div>
              )}
            </div>
          </section>
        </InputForm>
      </div>

      {/* ── Sticky Footer ────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 px-6 py-4 bg-background/80 backdrop-blur-md border-t border-border">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {selectedCount > 0
            ? `${selectedCount} khung giờ được chọn`
            : "Chưa chọn khung giờ nào"}
        </span>
        <div className="flex items-center gap-3 ml-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            form="create-tutor-request-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Đăng yêu cầu
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Micro-components ─────────────────────────────────────────────────────────

function SectionLabel({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon && (
        <span className="text-muted-foreground">{icon}</span>
      )}
      <h3 className="font-semibold text-foreground uppercase tracking-widest text-[10px]">
        {text}
      </h3>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-sm border ${color}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
