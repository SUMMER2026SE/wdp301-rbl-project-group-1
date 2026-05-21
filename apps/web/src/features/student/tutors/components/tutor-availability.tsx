import { Calendar } from "lucide-react";
import type { TutorAvailability } from "../types";

interface TutorAvailabilityProps {
  availability: TutorAvailability;
}

export function TutorAvailabilityCard({
  availability,
}: TutorAvailabilityProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
        <Calendar className="size-5" />
        Lịch trống dự kiến
      </h3>

      <div className="mb-2 grid grid-cols-8 gap-1 text-center text-xs font-medium text-muted-foreground">
        <div></div>
        {availability.days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="space-y-1">
        {availability.periods.map((period) => (
          <div key={period.label} className="grid grid-cols-8 gap-1">
            <div className="py-1 text-xs text-muted-foreground">
              {period.label}
            </div>
            {period.slots.map((isAvailable, index) => (
              <div
                key={`${period.label}-${index}`}
                className={
                  isAvailable
                    ? "rounded border border-success/30 bg-success/20"
                    : "rounded bg-muted"
                }
                title={isAvailable ? "Có lịch trống" : "Kín lịch"}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-foreground">
          <div className="size-3 rounded-sm border border-success/30 bg-success/20" />
          <span>Có thể học</span>
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          <div className="size-3 rounded-sm bg-muted" />
          <span>Kín lịch</span>
        </div>
      </div>
    </div>
  );
}
