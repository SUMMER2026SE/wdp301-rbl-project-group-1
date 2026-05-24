"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Controller, useForm, useWatch } from "react-hook-form";

interface NotesFormValues {
  notes: string;
}

export function ClassNotesSection() {
  const { control, handleSubmit } = useForm<NotesFormValues>({
    defaultValues: { notes: "" },
  });

  const notesValue = useWatch({ control, name: "notes" });

  const onSubmit = (data: NotesFormValues) => {
    console.log("Saving notes:", data.notes);
  };

  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Ghi chú lớp học
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Thêm ghi chú riêng cho lớp này..."
              className="min-h-[120px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none"
            />
          )}
        />

        <Button
          type="submit"
          disabled={!notesValue?.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg h-10 px-6 transition-colors"
        >
          Lưu ghi chú
        </Button>
      </form>
    </section>
  );
}
