"use client";

import { PriceRangeSlider } from "@/src/shared/components/atoms/price-range-slider/price-range-slider";
import { Button } from "@/src/shared/components/ui/button";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { cn } from "@/src/shared/lib/utils";
import { useState } from "react";

const STAR_RATINGS = [
  { value: 5, label: "5 sao", stars: 5 },
  { value: 4, label: "4 sao trở lên", stars: 4 },
  { value: 3, label: "3 sao trở lên", stars: 3 },
];

export interface FilterSubjectsConfig {
  label?: string;
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export interface FilterSecondaryConfig {
  label: string;
  items: { id: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export interface FilterPriceConfig {
  label?: string;
  current: [number, number];
  sliderMin?: number;
  sliderMax?: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

export interface FilterRatingConfig {
  label?: string;
  value: number;
  onChange: (value: number) => void;
}

export interface FilterSidebarProps {
  subjects?: FilterSubjectsConfig;
  secondary?: FilterSecondaryConfig;
  price?: FilterPriceConfig;
  rating?: FilterRatingConfig;
  onClear: () => void;
  className?: string;
}

export function FilterSidebar({
  subjects,
  secondary,
  price,
  rating,
  onClear,
  className,
}: FilterSidebarProps) {
  const [expandedSubjects, setExpandedSubjects] = useState(false);

  const handleSubjectChange = (item: string, checked: boolean) => {
    if (!subjects) return;
    const next = checked
      ? [...subjects.selected, item]
      : subjects.selected.filter((s) => s !== item);
    subjects.onChange(next);
  };

  const handleSecondaryChange = (id: string, checked: boolean) => {
    if (!secondary) return;
    const next = checked
      ? [...secondary.selected, id]
      : secondary.selected.filter((s) => s !== id);
    secondary.onChange(next);
  };

  return (
    <aside
      className={cn(
        "w-full lg:w-72 flex-shrink-0 flex flex-col gap-6",
        className,
      )}
    >
      <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Bộ lọc</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-sm font-medium text-muted-foreground hover:text-primary h-auto p-0"
          >
            Xóa lọc
          </Button>
        </div>

        {/* Subjects section */}
        {subjects && (
          <div className="mb-6 border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              {subjects.label ?? "Môn học"}
            </h3>
            <div className="flex flex-col gap-2">
              {subjects.items
                .slice(0, expandedSubjects ? subjects.items.length : 5)
                .map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={subjects.selected.includes(item)}
                      onCheckedChange={(checked) =>
                        handleSubjectChange(item, !!checked)
                      }
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              {subjects.items.length > 5 && (
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
        )}

        {/* Secondary filter section (e.g. "Cấp độ", "Hình thức") */}
        {secondary && (
          <div className="mb-6 border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              {secondary.label}
            </h3>
            <div className="flex flex-col gap-2">
              {secondary.items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={secondary.selected.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleSecondaryChange(item.id, !!checked)
                    }
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price range section */}
        {price && (
          <div className="mb-6 border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              {price.label ?? "Khoảng giá"}
            </h3>
            <PriceRangeSlider
              min={price.current[0]}
              max={price.current[1]}
              onChange={price.onChange}
              sliderMin={price.sliderMin}
              sliderMax={price.sliderMax}
              step={price.step}
            />
          </div>
        )}

        {/* Rating section */}
        {rating && (
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">
              {rating.label ?? "Đánh giá"}
            </h3>
            <div className="flex flex-col gap-2">
              {STAR_RATINGS.map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={rating.value === item.value}
                    onCheckedChange={() => rating.onChange(item.value)}
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(item.stars)].map((_, i) => (
                      <span key={i} className="text-warning">
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-foreground ml-1">
                      {item.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
