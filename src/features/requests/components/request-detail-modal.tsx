"use client";

import React from "react";
import Modal from "@/src/shared/components/molecules/modal/modal";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import { X, FileText, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { BookingRequest } from "../mocks/requests.mock";
import { RequestStatusBadge } from "./request-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/ui/avatar";
import { Separator } from "@/src/shared/components/ui/separator";

interface RequestDetailModalProps {
  request: BookingRequest;
  role: "student" | "tutor";
  trigger: React.ReactNode;
}

const CustomHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between border-b border-border/50 bg-card px-6 py-4 sticky top-0 z-10 w-full">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-xl text-primary">
        <FileText className="size-5" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
    </div>
    <DialogClose asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-90 transition-all">
        <X className="size-4" />
      </Button>
    </DialogClose>
  </div>
);

export function RequestDetailModal({ request, role, trigger }: RequestDetailModalProps) {
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(request.createdAt));

  const counterpartLabel = role === "student" ? "Gia sư" : "Học viên";

  return (
    <Modal
      trigger={trigger}
      title={`Chi tiết yêu cầu ${request.id}`}
      description=""
      formId="request-detail-form"
      contentClassName="max-w-2xl sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background rounded-3xl"
      hideDefaultFooter={true}
      customHeader={<CustomHeader title={`Chi tiết yêu cầu #${request.id.replace("req-", "")}`} />}
    >
      <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
        {/* Top Status & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Ngày tạo</p>
            <p className="font-semibold text-foreground">{formattedDate}</p>
          </div>
          <div>
            <RequestStatusBadge status={request.status} />
          </div>
        </div>

        {/* Counterpart Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-5 flex items-center gap-4 mb-6 shadow-sm">
          <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
            <AvatarImage src={request.counterpartAvatar} />
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-semibold">
              {request.counterpartName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{counterpartLabel}</p>
            <h3 className="text-lg font-bold text-foreground">{request.counterpartName}</h3>
          </div>
        </div>

        {/* Request Details */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Thông tin khóa học</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3">
                <FileText className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Khóa học</p>
                  <p className="font-semibold text-sm text-foreground">{request.courseName}</p>
                </div>
              </div>
              <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3">
                <Calendar className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lịch học</p>
                  <p className="font-semibold text-sm text-foreground">{request.schedule}</p>
                </div>
              </div>
              <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3">
                <DollarSign className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Chi phí (ước tính)</p>
                  <p className="font-semibold text-sm text-foreground">
                    {request.price === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(request.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Lời nhắn</h4>
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3 relative overflow-hidden">
              <MessageSquare className="size-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="z-10 relative">
                {request.message ? (
                  <p className="text-sm text-foreground leading-relaxed italic">&quot;{request.message}&quot;</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Không có lời nhắn nào được để lại.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-border/50">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl px-6 h-11 border-border/50">
              Đóng
            </Button>
          </DialogClose>
          {request.status === "pending" && role === "tutor" && request.type === "received" && (
            <>
              <Button variant="destructive" className="rounded-xl px-6 h-11">
                Từ chối
              </Button>
              <Button className="rounded-xl px-6 h-11 shadow-sm">
                Chấp nhận
              </Button>
            </>
          )}
          {request.status === "pending" && request.type === "sent" && (
            <Button variant="destructive" className="rounded-xl px-6 h-11">
              Hủy yêu cầu
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
