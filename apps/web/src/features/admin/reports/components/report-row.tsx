import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";

import { severityClassName } from "./reports.constants";
import type { ReportItem } from "./reports.types";

type ReportRowProps = {
  report: ReportItem;
};

export function ReportRow({ report }: ReportRowProps) {
  return (
    <tr
      className={`cursor-pointer transition-colors hover:bg-muted/30 ${
        report.active ? "border-l-4 border-primary bg-primary/5" : ""
      } ${report.closed ? "opacity-70" : ""}`}
    >
      <td className="p-4">
        <p className="font-bold text-foreground">{report.id}</p>
        <p className="text-muted-foreground">{report.reason}</p>
      </td>
      <td className="p-4">
        <p className="font-medium text-foreground">
          {report.reporter} ({report.reporterRole})
        </p>
        <p className="text-xs text-muted-foreground">
          Đối tượng: {report.target}
        </p>
      </td>
      <td className="p-4">
        <Badge className={severityClassName[report.severity]}>
          {report.severityLabel}
        </Badge>
      </td>
      <td className="p-4 text-muted-foreground">{report.time}</td>
      <td className="p-4 text-right">
        <Button variant="link" size="sm" className="px-0">
          {report.closed ? "Xem lại" : "Chi tiết"}
        </Button>
      </td>
    </tr>
  );
}
