import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

import { reports } from "./reports.constants";
import { ReportRow } from "./report-row";
import { ReportsTableToolbar } from "./reports-table-toolbar";

export function ReportsTable() {
  return (
    <Card className="shadow-sm lg:col-span-2">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-bold">
            Danh sách Khiếu nại
          </CardTitle>
          <ReportsTableToolbar />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-4 font-medium">Mã & Lý do</th>
                <th className="p-4 font-medium">
                  Người gửi / Bị khiếu nại
                </th>
                <th className="p-4 font-medium">Mức độ</th>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <ReportRow key={report.id} report={report} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
