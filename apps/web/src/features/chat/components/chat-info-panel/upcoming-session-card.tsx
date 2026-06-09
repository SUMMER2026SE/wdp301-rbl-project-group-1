import { Button } from "@/src/shared/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import type { UpcomingSession } from "../../types";

interface UpcomingSessionCardProps {
  session: UpcomingSession;
}

function formatSessionDate(date: Date): string {
  const days = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return `${days[date.getDay()]}, ${date.getDate()} Tháng ${date.getMonth() + 1}`;
}

export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  return (
    <div className="p-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        Buổi học sắp tới
      </h4>
      <div className="bg-muted/50 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground">
            {formatSessionDate(session.date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            {session.startTime} - {session.endTime}
          </span>
        </div>
        {session.topic && (
          <p className="text-xs text-muted-foreground pt-0.5">
            Chủ đề: {session.topic}
          </p>
        )}
        <Button className="w-full mt-1" size="sm">
          Vào lớp
        </Button>
      </div>
    </div>
  );
}
