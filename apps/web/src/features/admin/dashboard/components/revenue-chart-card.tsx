import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { cn } from "@/src/shared/lib/utils";
import { BarChart3 } from "lucide-react";
import { revenueBars } from "./admin-dashboard.constants";

export function RevenueChartCard() {
  return (
    <Card className="shadow-sm lg:col-span-2">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold">
            Biến động Doanh thu
          </CardTitle>
          <Select defaultValue="current-month">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Tháng này</SelectItem>
              <SelectItem value="previous-month">Tháng trước</SelectItem>
              <SelectItem value="current-year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex min-h-[300px] flex-col justify-between rounded-lg border border-dashed border-border bg-muted/40 p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="size-5" />
            <span className="text-sm font-medium">Doanh thu theo tuần</span>
          </div>
          <div className="flex h-56 items-end gap-3">
            {revenueBars.map((bar) => (
              <div
                key={bar.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-44 w-full items-end rounded-md bg-background">
                  <div className={cn("w-full rounded-md bg-primary", bar.height)} />
                </div>
                <span className="text-xs text-muted-foreground">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
