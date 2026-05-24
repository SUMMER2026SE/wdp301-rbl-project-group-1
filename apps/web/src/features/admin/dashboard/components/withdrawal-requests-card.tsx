import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Filter } from "lucide-react";
import { withdrawals } from "./admin-dashboard.constants";

export function WithdrawalRequestsCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold">Yêu cầu Rút tiền</CardTitle>
          <Button variant="ghost" size="sm">
            <Filter className="size-4" />
            Lọc
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-4 font-medium">Gia sư</th>
                <th className="p-4 font-medium">Số tiền</th>
                <th className="p-4 font-medium">Ngày yêu cầu</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {withdrawals.map((request) => (
                <tr
                  key={request.tutor}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="p-4 font-medium text-foreground">
                    {request.tutor}
                  </td>
                  <td className="p-4 font-semibold text-foreground">
                    {request.amount}
                  </td>
                  <td className="p-4 text-muted-foreground">{request.date}</td>
                  <td className="p-4">
                    <Badge className="bg-warning-soft text-warning hover:bg-warning-soft">
                      {request.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="link" size="sm" className="px-0">
                      Xử lý
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
