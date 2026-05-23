"use client";

import SearchBox from "@/src/shared/components/molecules/search-box/search-box";
import { Button } from "@/src/shared/components/ui/button";
import { Search } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CoursesFilterFormData } from "../schemas/filter.schema";

interface CoursesSearchSectionProps {
  form: UseFormReturn<CoursesFilterFormData>;
  totalCount: number;
}

export function CoursesSearchSection({
  form,
  totalCount,
}: CoursesSearchSectionProps) {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-primary/10 via-info/10 to-secondary/10 border border-border p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Khám phá hàng ngàn khóa học chất lượng
        </h1>
        <p className="text-muted-foreground mb-6">
          Trau dồi kiến thức và kỹ năng mới mỗi ngày cùng đội ngũ gia sư và
          giảng viên hàng đầu.
        </p>
        <div className="flex gap-3">
          <SearchBox
            placeholder="Tìm kiếm khóa học, môn học, kỹ năng..."
            className="flex-1"
            {...form.register("search")}
          />
          <Button size="lg" className="shrink-0">
            <Search className="size-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>

        {/* Result count hint */}
        <p className="mt-4 text-sm text-muted-foreground">
          Tìm thấy{" "}
          <span className="font-bold text-foreground">{totalCount}</span> khóa
          học phù hợp
        </p>
      </div>
    </section>
  );
}
