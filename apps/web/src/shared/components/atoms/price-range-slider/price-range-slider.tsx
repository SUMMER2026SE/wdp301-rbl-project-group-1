"use client";

import { Slider } from "@/src/shared/components/ui/slider";
import { cn } from "@/src/shared/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  minLabel?: string;
  maxLabel?: string;
  sliderMin?: number;
  sliderMax?: number;
  step?: number;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  onChange,
  minLabel = "Từ:",
  maxLabel = "Đến:",
  sliderMin = 50000,
  sliderMax = 1000000,
  step = 50000,
  className,
}: PriceRangeSliderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">{minLabel}</span>
          <span className="font-bold text-foreground">
            {min.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground">{maxLabel}</span>
          <span className="font-bold text-foreground">
            {max.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      <Slider
        min={sliderMin}
        max={sliderMax}
        step={step}
        value={[min, max]}
        onValueChange={(values) => {
          if (values.length === 2) {
            onChange(values[0], values[1]);
          }
        }}
        className="pt-2"
      />
    </div>
  );
}
