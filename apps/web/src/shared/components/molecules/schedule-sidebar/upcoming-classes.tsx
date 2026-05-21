import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/shared/components/ui/card";
import { UpcomingClassItem } from "./types";

export interface UpcomingClassesProps {
  title?: string;
  emptyMessage?: string;
  classes: UpcomingClassItem[];
}

export function UpcomingClasses({
  title = "Các buổi học sắp tới",
  emptyMessage = "Không có buổi học nào sắp tới",
  classes,
}: UpcomingClassesProps) {
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
      <CardContent className="space-y-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-3 rounded-lg border border-border bg-muted/50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {cls.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cls.date} • {cls.time}
                </p>
              </div>
              {cls.status && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    cls.status === "happening"
                      ? "bg-schedule-orange-light text-schedule-orange-text"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cls.status === "happening" ? "Thay đổi" : "Sắp tới"}
                </span>
              )}
            </div>
            {cls.subtitle && (
              <p className="text-xs text-muted-foreground">{cls.subtitle}</p>
            )}
            {cls.note && (
              <p className="text-xs text-muted-foreground mt-1">{cls.note}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
