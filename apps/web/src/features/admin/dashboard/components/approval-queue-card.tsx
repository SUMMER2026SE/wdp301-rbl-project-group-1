import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { approvalQueue } from "./admin-dashboard.constants";

export function ApprovalQueueCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold">
            Hàng đợi Phê duyệt
          </CardTitle>
          <Button variant="link" size="sm" className="px-0">
            Xem tất cả
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {approvalQueue.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="font-bold">
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.subject} • {item.time}
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Xem
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
