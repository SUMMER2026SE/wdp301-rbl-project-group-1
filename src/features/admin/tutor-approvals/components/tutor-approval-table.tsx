import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";

import { tutorApplications } from "./tutor-approvals.constants";
import { TutorApplicationRow } from "./tutor-application-row";
import { TutorApprovalsPagination } from "./tutor-approvals-pagination";

export function TutorApprovalTable() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border bg-muted/50 pb-4">
        <CardTitle className="text-lg font-bold">
          Hàng đợi phê duyệt (12)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-4 font-medium">Gia sư</th>
                <th className="p-4 font-medium">Chuyên môn</th>
                <th className="p-4 font-medium">Bằng cấp/Chứng chỉ</th>
                <th className="p-4 font-medium">Ngày gửi</th>
                <th className="p-4 text-center font-medium">Trạng thái</th>
                <th className="p-4 text-center font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tutorApplications.map((application) => (
                <TutorApplicationRow
                  key={application.email}
                  application={application}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            Hiển thị 1 - 3 của 12 hồ sơ
          </span>
          <TutorApprovalsPagination />
        </div>
      </CardContent>
    </Card>
  );
}
