import { TodaySchedule as SharedTodaySchedule } from "@/src/shared/components/molecules/schedule-sidebar/today-schedule";
import type { TodayClassItem } from "@/src/shared/components/molecules/schedule-sidebar/types";
import { TodayClass } from "../types";

interface TodayScheduleProps {
  classes: TodayClass[];
}

function mapToShared(cls: TodayClass): TodayClassItem {
  return {
    id: cls.id,
    time: cls.time,
    title: cls.title,
    status: cls.status,
    subtitle: cls.tutorName ? `GV: ${cls.tutorName}` : undefined,
  };
}

export function TodaySchedule({ classes }: TodayScheduleProps) {
  return (
    <SharedTodaySchedule
      title="Lịch học hôm nay"
      emptyMessage="Không có lớp học hôm nay"
      classes={classes.map(mapToShared)}
    />
  );
}
