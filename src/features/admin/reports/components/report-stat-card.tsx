import { Card, CardContent } from "@/src/shared/components/ui/card";

import type { ReportStat } from "./reports.types";

type ReportStatCardProps = {
  stat: ReportStat;
};

export function ReportStatCard({ stat }: ReportStatCardProps) {
  const Icon = stat.icon;
  const TrendIcon = stat.trendIcon;

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.iconTone}`}
          >
            <Icon className="size-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className={`flex items-center gap-1 text-sm font-medium ${stat.changeTone}`}>
            <TrendIcon className="size-4" />
            {stat.change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
