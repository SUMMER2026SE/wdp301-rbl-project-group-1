import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Check, Eye, X } from "lucide-react";

import { CertificateList } from "./certificate-list";
import type { TutorApplication } from "./tutor-approvals.types";

type TutorApplicationRowProps = {
  application: TutorApplication;
};

export function TutorApplicationRow({ application }: TutorApplicationRowProps) {
  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar size="md" fallback={application.name} />
          <div>
            <p className="font-medium text-foreground">{application.name}</p>
            <p className="text-xs text-muted-foreground">{application.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {application.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">
              {subject}
            </Badge>
          ))}
        </div>
      </td>
      <td className="p-4">
        <CertificateList certificates={application.certificates} />
      </td>
      <td className="p-4 text-muted-foreground">{application.submittedAt}</td>
      <td className="p-4 text-center">
        <Badge className="h-5 rounded-full border border-amber-200 bg-amber-50 px-2 text-[10px] text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Đang chờ
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="icon-sm"
            className="bg-blue-soft text-foreground hover:bg-blue-soft/80"
            title="Xem chi tiết"
          >
            <Eye className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            className="bg-blue-700 hover:bg-blue-800"
            title="Phê duyệt"
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
            title="Từ chối"
          >
            <X className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
