import type { UpcomingClassItem } from "@/src/shared/components/molecules/schedule-sidebar/types";
import { UpcomingClasses as SharedUpcomingClasses } from "@/src/shared/components/molecules/schedule-sidebar/upcoming-classes";
import { UpcomingClass } from "../types";

interface UpcomingClassesProps {
  classes: UpcomingClass[];
}

function mapToShared(cls: UpcomingClass): UpcomingClassItem {
  return {
    id: cls.id,
    date: cls.date,
    time: cls.time,
    title: cls.title,
    status: cls.status,
    subtitle: cls.tutorName ? `GV: ${cls.tutorName}` : undefined,
    note: cls.note,
  };
}

export function UpcomingClasses({ classes }: UpcomingClassesProps) {
  return (
    <SharedUpcomingClasses
      title="Các buổi học bổ sung"
      emptyMessage="Không có buổi học bổ sung nào"
      classes={classes.map(mapToShared)}
    />
  );
}
