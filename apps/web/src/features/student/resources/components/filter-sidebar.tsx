"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { DOCUMENT_TYPES, TAGS } from "../mock-data";
import {
  filterFormSchema,
  type FilterFormValues,
} from "../schemas/filter-schemas";
import type { FilterState } from "../types";

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const { control, handleSubmit } = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    mode: "onSubmit",
    defaultValues: {
      search: "",
      documentTypes: ["pdf", "word", "video"],
      categories: [],
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    onFilterChange?.({
      documentTypes: data.documentTypes,
      categories: data.categories,
      search: data.search,
    });
  };

  return (
    <aside className="flex flex-col gap-6 lg:col-span-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Search box */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold text-foreground">Lọc tài liệu</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Tìm theo tên..."
                  className="pl-9"
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Document types */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold text-foreground">Định dạng</h3>
          <div className="flex flex-col gap-3">
            <Controller
              name="documentTypes"
              control={control}
              render={({ field }) => (
                <>
                  {DOCUMENT_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`doctype-${type.id}`}
                        checked={(field.value || []).includes(type.id)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, type.id]);
                          } else {
                            field.onChange(
                              currentValue.filter((t: string) => t !== type.id),
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`doctype-${type.id}`}
                        className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold text-foreground">Từ khóa</h3>
          <div className="flex flex-wrap gap-2">
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <>
                  {TAGS.map((tag) => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={
                        (field.value || []).includes(tag)
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full text-xs"
                      type="button"
                      onClick={() => {
                        const currentValue = field.value || [];
                        if (currentValue.includes(tag)) {
                          field.onChange(
                            currentValue.filter((t: string) => t !== tag),
                          );
                        } else {
                          field.onChange([...currentValue, tag]);
                        }
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        {/* Apply button */}
        <Button className="w-full font-bold" type="submit">
          Áp dụng bộ lọc
        </Button>
      </form>
    </aside>
  );
}
