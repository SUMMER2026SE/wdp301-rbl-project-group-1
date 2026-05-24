import { Card, CardContent } from "@/src/shared/components/ui/card";
import { cn } from "@/src/shared/lib/utils";
import { TrendingUp } from "lucide-react";
import type { StatItem } from "./admin-dashboard.types";

export function StatCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon;

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              stat.tone
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <div className="flex items-end gap-1">
            <p className="text-2xl font-bold leading-none text-foreground">
              {stat.value}
            </p>
            {stat.suffix && (
              <span className="pb-0.5 text-sm font-semibold leading-none text-foreground">
                {stat.suffix}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 pb-0.5 text-sm font-medium leading-none text-success">
            <TrendingUp className="size-4" />
            {stat.change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
