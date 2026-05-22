"use client";

import { PriceRangeSlider } from "@/src/shared/components/atoms/price-range-slider/price-range-slider";
import { Button } from "@/src/shared/components/ui/button";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FilterFormData } from "../schemas/filter.schema";

interface FilterSidebarProps {
  form: UseFormReturn<FilterFormData>;
}

const SUBJECTS = [
  "Toán học",
  "Vật lý",
  "Tiếng Anh",
  "Hóa học",
  "Ngữ văn",
  "Sinh học",
];

const LEVELS = [
  { id: "cap-1", label: "Cấp 1" },
  { id: "cap-2", label: "Cấp 2" },
  { id: "cap-3", label: "Cấp 3" },
  { id: "dai-hoc", label: "Đại học" },
  { id: "ielts-toeic", label: "IELTS/TOEIC" },
];

const RATINGS = [
  { value: 5, label: "5 sao", stars: 5 },
  { value: 4, label: "4 sao trở lên", stars: 4 },
  { value: 3, label: "3 sao trở lên", stars: 3 },
];

export function FilterSidebar({ form }: FilterSidebarProps) {
  const [expandedSubjects, setExpandedSubjects] = useState(false);

  const subjects = form.watch("subjects");
  const levels = form.watch("levels");
  const priceRange = form.watch("priceRange");
  const rating = form.watch("rating");

  const handleClearFilters = () => {
    form.reset({
      subjects: [],
      levels: [],
      priceRange: [50000, 1000000],
      rating: 0,
      search: "",
      sortBy: "rating",
    });
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const newSubjects = checked
      ? [...subjects, subject]
      : subjects.filter((s) => s !== subject);
    form.setValue("subjects", newSubjects);
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...levels, level]
      : levels.filter((l) => l !== level);
    form.setValue("levels", newLevels);
  };

  const handlePriceChange = (min: number, max: number) => {
    form.setValue("priceRange", [min, max]);
  };

  const handleRatingChange = (ratingValue: number) => {
    form.setValue("rating", ratingValue);
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Bộ lọc</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-sm font-medium text-muted-foreground hover:text-primary h-auto p-0"
          >
            Xóa lọc
          </Button>
        </div>

        {/* Subjects */}
        <div className="mb-6 border-t border-border pt-4">
          <h3 className="font-semibold text-foreground mb-3">Môn học</h3>
          <div className="flex flex-col gap-2">
            {SUBJECTS.slice(0, expandedSubjects ? SUBJECTS.length : 5).map(
              (subject) => (
                <label
                  key={subject}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={subjects.includes(subject)}
                    onCheckedChange={(checked) => {
                      handleSubjectChange(subject, !!checked);
                    }}
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {subject}
                  </span>
                </label>
              ),
            )}
            {SUBJECTS.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedSubjects(!expandedSubjects)}
                className="text-sm text-primary font-medium mt-1 text-left h-auto p-0 justify-start"
              >
                {expandedSubjects ? "Ẩn bớt" : "Xem thêm"}
              </Button>
            )}
          </div>
        </div>

        {/* Levels */}
        <div className="mb-6 border-t border-border pt-4">
          <h3 className="font-semibold text-foreground mb-3">Cấp độ</h3>
          <div className="flex flex-col gap-2">
            {LEVELS.map((level) => (
              <label
                key={level.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  checked={levels.includes(level.id)}
                  onCheckedChange={(checked) => {
                    handleLevelChange(level.id, !!checked);
                  }}
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {level.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6 border-t border-border pt-4">
          <h3 className="font-semibold text-foreground mb-3">Giá tiền</h3>
          <PriceRangeSlider
            min={priceRange[0]}
            max={priceRange[1]}
            onChange={handlePriceChange}
          />
        </div>

        {/* Rating */}
        <div className="border-t border-border pt-4">
          <h3 className="font-semibold text-foreground mb-3">Đánh giá</h3>
          <div className="flex flex-col gap-2">
            {RATINGS.map((ratingItem) => (
              <label
                key={ratingItem.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  checked={rating === ratingItem.value}
                  onCheckedChange={() => {
                    handleRatingChange(ratingItem.value);
                  }}
                />
                <div className="flex items-center gap-1">
                  {[...Array(ratingItem.stars)].map((_, i) => (
                    <span key={i} className="text-warning">
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-foreground ml-1">
                    {ratingItem.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
