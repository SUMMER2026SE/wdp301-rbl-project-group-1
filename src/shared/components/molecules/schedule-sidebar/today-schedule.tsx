import { Button } from "@/src/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/shared/components/ui/card";
import { Calendar } from "lucide-react";
import { TodayClassItem } from "./types";

export interface TodayScheduleProps {
  title?: string;
  emptyMessage?: string;
  classes: TodayClassItem[];
  onJoinClass?: (id: string) => void;
}

export function TodaySchedule({
  title = "Lịch hôm nay",
  emptyMessage = "Không có lớp học hôm nay",
  classes,
  onJoinClass,
}: TodayScheduleProps) {
  if (classes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-4 rounded-lg border border-border bg-muted/50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-foreground text-sm">
                  {cls.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cls.time}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  cls.status === "happening"
                    ? "bg-schedule-emerald-light text-schedule-emerald-text"
                    : "bg-schedule-blue-light text-schedule-blue-text"
                }`}
              >
                {cls.status === "happening" ? "Đang diễn ra" : "Sắp tới"}
              </span>
            </div>
            {cls.subtitle && (
              <p className="text-xs text-muted-foreground">{cls.subtitle}</p>
            )}
            {cls.meta && (
              <p className="text-xs text-muted-foreground mt-1">{cls.meta}</p>
            )}
            <Button
              className="w-full mt-3 h-9 text-xs font-medium rounded-lg"
              onClick={() => onJoinClass?.(cls.id)}
            >
              <Calendar className="size-4 mr-1" />
              Vào lớp ngay
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
