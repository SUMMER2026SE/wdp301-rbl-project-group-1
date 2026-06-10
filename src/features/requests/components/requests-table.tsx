"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import { BookingRequest } from "../mocks/requests.mock";
import { RequestStatusBadge } from "./request-status-badge";
import { RequestDetailModal } from "./request-detail-modal";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface RequestsTableProps {
  requests: BookingRequest[];
  role: "student" | "tutor";
}

export function RequestsTable({ requests, role }: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-border/50 border-dashed rounded-3xl bg-card/30">
        <div className="h-16 w-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl opacity-50">📋</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Chưa có yêu cầu nào</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Bạn chưa có yêu cầu nào trong mục này. Khi có yêu cầu mới, chúng sẽ xuất hiện ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b-border/50">
            <TableHead className="w-[300px] font-semibold text-muted-foreground">
              {role === "student" ? "Gia sư" : "Học viên"}
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">Khóa học / Lịch học</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Ngày tạo</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Trạng thái</TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id} className="hover:bg-muted/30 border-b-border/50 transition-colors group">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border/50">
                    <AvatarImage src={req.counterpartAvatar} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                      {req.counterpartName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground line-clamp-1">{req.counterpartName}</span>
                    <span className="text-xs text-muted-foreground">ID: {req.id}</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground line-clamp-1">{req.courseName}</span>
                  <span className="text-xs text-muted-foreground">{req.schedule}</span>
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(req.createdAt))}
                </span>
              </TableCell>
              
              <TableCell className="py-4">
                <RequestStatusBadge status={req.status} />
              </TableCell>
              
              <TableCell className="py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity items-center">
                  {req.status === "awaiting_payment" && role === "student" && (
                    <Button asChild size="sm" className="h-8 px-3 text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 shadow-sm">
                      <Link href={`/payment/checkout?bookingId=${req.id}&amount=${req.price}&courseTitle=${encodeURIComponent(req.courseName)}&tutorName=${encodeURIComponent(req.counterpartName)}`}>
                        Thanh toán
                      </Link>
                    </Button>
                  )}
                  <RequestDetailModal
                    request={req}
                    role={role}
                    trigger={
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium rounded-lg hover:bg-primary/10 hover:text-primary">
                        Chi tiết
                      </Button>
                    }
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
