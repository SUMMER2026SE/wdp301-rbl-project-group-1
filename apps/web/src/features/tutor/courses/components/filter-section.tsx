"use client";

import SearchBox from "@/src/shared/components/molecules/search-box/search-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { filterSchema, type FilterValues } from "../schemas/filter-schema";

interface FilterSectionProps {
  onSearch?: (query: string) => void;
  onSubjectChange?: (subject: string) => void;
  onStatusChange?: (status: string) => void;
}

export function FilterSection({
  onSearch,
  onSubjectChange,
  onStatusChange,
}: FilterSectionProps) {
  const { control } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      subject: "all",
      status: "ALL",
    },
  });

  const search = useWatch({ control, name: "search" });
  const subject = useWatch({ control, name: "subject" });
  const status = useWatch({ control, name: "status" });

  useEffect(() => {
    onSearch?.(search);
  }, [search, onSearch]);

  useEffect(() => {
    onSubjectChange?.(subject);
  }, [subject, onSubjectChange]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Controller
        control={control}
        name="search"
        render={({ field }) => (
          <SearchBox
            className="flex-1"
            placeholder="Tìm kiếm tên lớp học..."
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex gap-2">
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                <SelectValue placeholder="Tất cả môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn học</SelectItem>
                <SelectItem value="math">Toán</SelectItem>
                <SelectItem value="english">Tiếng Anh</SelectItem>
                <SelectItem value="physics">Vật lý</SelectItem>
                <SelectItem value="chemistry">Hóa học</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[160px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="CONFIRMED">Đang hoạt động</SelectItem>
                <SelectItem value="COMPLETED">Đã kết thúc</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
}
