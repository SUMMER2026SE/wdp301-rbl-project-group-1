import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Image as ImageIcon, MessageSquare } from "lucide-react";

function EvidenceList() {
  return (
    <section>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
        Bằng chứng
      </h4>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-opacity hover:opacity-80">
          <ImageIcon className="size-6" />
        </div>
        <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-opacity hover:opacity-80">
          <MessageSquare className="size-6" />
        </div>
      </div>
    </section>
  );
}

function SessionInfoCard() {
  return (
    <section>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
        Thông tin buổi học
      </h4>
      <div className="space-y-2 rounded-lg border border-border p-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Mã buổi học:</span>
          <span className="font-medium text-foreground">BH-5592</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Thời gian:</span>
          <span className="text-right font-medium text-foreground">
            19:00 - 20:30, 25/10/2023
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Trạng thái:</span>
          <span className="font-medium text-destructive">Báo lỗi</span>
        </div>
      </div>
    </section>
  );
}

function PartyHistoryCard() {
  return (
    <section>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
        Lịch sử hai bên
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded bg-muted p-2">
          <span className="text-muted-foreground">Lê Văn Học (HS)</span>
          <Badge className="bg-success-soft text-success hover:bg-success-soft">
            0 Khiếu nại
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-3 rounded bg-muted p-2">
          <span className="text-muted-foreground">Nguyễn Gia Sư (GS)</span>
          <Badge className="bg-warning-soft text-warning hover:bg-warning-soft">
            1 Bị khiếu nại trước đó
          </Badge>
        </div>
      </div>
    </section>
  );
}

function ReportActions() {
  return (
    <div className="space-y-3 border-t border-border bg-muted/50 p-4">
      <h4 className="text-sm font-semibold text-foreground">
        Hành động xử lý
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" className="bg-info-soft text-info hover:bg-info-soft/80">
          Hòa giải
        </Button>
        <Button className="bg-success-soft text-success hover:bg-success-soft/80">
          Hoàn tiền
        </Button>
        <Button className="bg-warning-soft text-warning hover:bg-warning-soft/80">
          Cảnh báo Gia sư
        </Button>
        <Button variant="destructive">Khóa tài khoản</Button>
      </div>
    </div>
  );
}

export function ComplaintDetailCard() {
  return (
    <Card className="h-[600px] shadow-sm">
      <CardHeader className="border-b border-border bg-muted/50 pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-bold">Chi tiết #KN-1024</CardTitle>
          <Badge className="bg-warning-soft text-warning hover:bg-warning-soft">
            Chưa xử lý
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Nội dung khiếu nại
            </h4>
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              Gia sư không xuất hiện trong buổi học lúc 19:00 ngày 25/10. Em đã
              nhắn tin và gọi điện trên hệ thống nhưng không có phản hồi. Mong
              admin giải quyết hoàn tiền giúp em.
            </div>
          </section>

          <EvidenceList />
          <SessionInfoCard />
          <PartyHistoryCard />
        </div>

        <ReportActions />
      </CardContent>
    </Card>
  );
}
