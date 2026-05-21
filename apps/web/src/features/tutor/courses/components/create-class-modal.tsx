"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import SelectBox from "@/src/shared/components/atoms/select-box/select-box";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useModalContext } from "@/src/shared/context/modal-context";
import { WithModal } from "@/src/shared/hocs/with-modal";

import {
  createClassSchema,
  type CreateClassFormValues,
} from "../schemas/create-class-schema";
import { subjects, type Schedule } from "../types";
import { ScheduleRow } from "./schedule-row";

const FORM_ID = "create-class-form";

// Inner form fields — must be rendered inside FormProvider (provided by InputForm)
function CreateClassFormFields({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}: {
  schedules: Schedule[];
  onAddSchedule: () => void;
  onUpdateSchedule: (id: string, field: keyof Schedule, value: string) => void;
  onDeleteSchedule: (id: string) => void;
}) {
  const { control } = useFormContext<CreateClassFormValues>();

  return (
    <div className="p-6 overflow-y-auto overflow-x-hidden flex flex-col gap-6 flex-1 min-h-0">
      {/* Thông tin chung */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Thông tin chung
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <TextBox
              name="className"
              id="className"
              label="Tên lớp học"
              placeholder="Ví dụ: Toán 10 - Nhóm A"
              type="text"
            />
          </div>

          <div>
            <SelectBox
              name="subject"
              id="subject"
              label="Môn học"
              placeholder="Chọn môn học"
              options={subjects}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Mô tả ngắn gọn
            </Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả về mục tiêu, đối tượng lớp học..."
                  {...field}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f1720] px-4 py-2 text-sm resize-none h-24"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Cài đặt lớp học */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Cài đặt lớp học
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="maxStudents"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Giới hạn học sinh <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="maxStudents"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="relative w-50">
                    <Input
                      id="maxStudents"
                      type="number"
                      min="1"
                      placeholder="Số lượng tối đa"
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                      className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f1720] px-4 py-2 text-sm pr-16"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-slate-500">
                      người
                    </span>
                  </div>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Lịch học */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Lịch học
          </h3>
          <Button
            type="button"
            variant="ghost"
            onClick={onAddSchedule}
            className="text-primary hover:text-blue-600 text-sm font-medium flex items-center gap-1 h-auto p-0"
          >
            <Plus className="size-4" />
            Thêm lịch
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {schedules.map((schedule) => (
            <ScheduleRow
              key={schedule.id}
              schedule={schedule}
              onUpdate={onUpdateSchedule}
              onDelete={onDeleteSchedule}
            />
          ))}
        </div>
      </div>

      {/* Tích hợp */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Tích hợp
        </h3>
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 flex items-start gap-3">
          <div className="mt-1 size-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm shrink-0">
            <svg className="size-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                fill="#4285F4"
              />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Google Meet tự động
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Một link Google Meet cố định sẽ được tạo tự động cho lớp học này.
            </p>
            <div className="mt-2 flex items-center gap-2 p-2 rounded bg-white dark:bg-[#0f1720] border border-slate-200 dark:border-slate-700">
              <Link2 className="size-4 text-slate-400 shrink-0" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-mono flex-1">
                Đang tạo tự động...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_SCHEDULES: Schedule[] = [
  { id: "1", dayOfWeek: "tuesday", startTime: "18:00", endTime: "19:30" },
  { id: "2", dayOfWeek: "thursday", startTime: "18:00", endTime: "19:30" },
];

function CreateClassModalContent() {
  const modal = useModalContext()!;

  const [schedules, setSchedules] = useState<Schedule[]>(DEFAULT_SCHEDULES);

  const handleAddSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        dayOfWeek: "monday",
        startTime: "18:00",
        endTime: "19:30",
      },
    ]);
  };

  const handleUpdateSchedule = (
    id: string,
    field: keyof Schedule,
    value: string,
  ) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (data: CreateClassFormValues) => {
    console.log("Form data:", { ...data, schedules });
    modal.closeModal();
  };

  const handleCancel = () => {
    modal.closeModal();
    setSchedules(DEFAULT_SCHEDULES);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      modal.openModal();
    } else {
      modal.closeModal();
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-lg h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
          <Plus className="size-5" />
          <span>Tạo lớp học mới</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-[#1A2633] shrink-0">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Tạo lớp học mới
          </DialogTitle>
        </DialogHeader>

        <InputForm
          id={FORM_ID}
          onSubmit={handleSubmit}
          resolver={zodResolver(createClassSchema)}
          defaultValues={{
            className: "",
            subject: "",
            description: undefined,
            maxStudents: 0,
          }}
          className="flex flex-col flex-1 min-h-0"
        >
          <CreateClassFormFields
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        </InputForm>

        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-6 pt-4 pb-6 bg-slate-50 dark:bg-slate-800/30">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            className="px-5 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-primary/20"
          >
            Tạo lớp học
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const CreateClassModal = WithModal(CreateClassModalContent);
