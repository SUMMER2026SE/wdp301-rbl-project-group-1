"use client";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export function PriceRangeSlider({
  min,
  max,
  onChange,
  minLabel = "Min:",
  maxLabel = "Max:",
}: PriceRangeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{minLabel}</span>
        <span className="font-bold text-foreground">
          {min.toLocaleString("vi-VN")}đ
        </span>
      </div>
      <input
        type="range"
        min="50000"
        max="1000000"
        step="50000"
        value={min}
        onChange={(e) => {
          const newMin = Number(e.target.value);
          if (newMin <= max) {
            onChange(newMin, max);
          }
        }}
        className="w-full"
      />
      <div className="flex items-center justify-between text-sm mt-3">
        <span className="text-muted-foreground">{maxLabel}</span>
        <span className="font-bold text-foreground">
          {max.toLocaleString("vi-VN")}đ
        </span>
      </div>
      <input
        type="range"
        min="50000"
        max="1000000"
        step="50000"
        value={max}
        onChange={(e) => {
          const newMax = Number(e.target.value);
          if (newMax >= min) {
            onChange(min, newMax);
          }
        }}
        className="w-full"
      />
    </div>
  );
}
