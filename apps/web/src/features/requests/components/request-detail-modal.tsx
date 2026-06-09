"use client";

import React from "react";
import Modal from "@/src/shared/components/molecules/modal/modal";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import { X, FileText, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
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

import { useAcceptBookingMutation, useRejectBookingMutation } from "../../booking/bookingApi";
import { useGetTutorRequestQuery, useAcceptTutorBidMutation } from "../../tutor-request/tutorRequestApi";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export function RequestDetailModal({ request, role, trigger }: RequestDetailModalProps) {
  const [acceptBooking, { isLoading: isAccepting }] = useAcceptBookingMutation();
  const [rejectBooking, { isLoading: isRejecting }] = useRejectBookingMutation();
  const [acceptTutorBid, { isLoading: isAcceptingBid }] = useAcceptTutorBidMutation();

  const { data: tutorRequestData, isLoading: isLoadingTutorRequest, refetch } = useGetTutorRequestQuery(
    { id: request.id },
    { skip: !request.isTutorRequest }
  );

  const handleAccept = async () => {
    try {
      await acceptBooking({ id: request.id }).unwrap();
      toast.success("Đã chấp nhận yêu cầu. Đang chờ học viên thanh toán.");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Có lỗi xảy ra khi chấp nhận yêu cầu");
    }
  };

  const handleReject = async () => {
    try {
      await rejectBooking({ id: request.id }).unwrap();
      toast.success("Đã từ chối yêu cầu!");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Có lỗi xảy ra khi từ chối yêu cầu");
    }
  };

  const router = useRouter();

  const handleAcceptBid = async (bidId: string) => {
    try {
      await acceptTutorBid({ requestId: request.id, bidId }).unwrap();
      toast.success("Đã chọn gia sư! Đang chờ thanh toán.");
      refetch();

    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Có lỗi xảy ra khi chấp nhận gia sư");
    }
  };

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(request.createdAt));

  const counterpartLabel = role === "student" ? "Gia sư" : "Học viên";
  
  // Real status if it's a tutor request
  const displayStatus = request.isTutorRequest && tutorRequestData?.data?.status
    ? (tutorRequestData.data.status === "OPEN" ? "pending" : tutorRequestData.data.status === "CLOSED" ? "completed" : "rejected")
    : request.status;

  return (
    <Modal
      trigger={trigger}
      title={`Chi tiết yêu cầu ${request.id}`}
      description=""
      formId="request-detail-form"
      contentClassName="max-w-2xl sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background rounded-3xl"
      hideDefaultFooter={true}
      customHeader={<CustomHeader title={`Chi tiết yêu cầu #${request.id.replace("req-", "").substring(0, 8)}`} />}
    >
      <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
        {/* Top Status & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Ngày tạo</p>
            <p className="font-semibold text-foreground">{formattedDate}</p>
          </div>
          <div>
            <RequestStatusBadge status={displayStatus} />
          </div>
        </div>

        {/* Counterpart Card */}
        {!request.isTutorRequest && (
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
        )}

        {/* Request Details */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Thông tin yêu cầu</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3">
                <FileText className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tiêu đề</p>
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
                    {request.price === 0 ? "Thoả thuận" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(request.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Lời nhắn / Mô tả chi tiết</h4>
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3 relative overflow-hidden">
              <MessageSquare className="size-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="z-10 relative">
                {request.message ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">&quot;{request.message}&quot;</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Không có mô tả nào được để lại.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Tutor Bids Section */}
          {request.isTutorRequest && (
            <>
              <Separator className="bg-border/50" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Danh sách Gia sư ứng tuyển</h4>
                
                {isLoadingTutorRequest ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="animate-spin text-muted-foreground size-6" />
                  </div>
                ) : tutorRequestData?.data?.bids && tutorRequestData.data.bids.length > 0 ? (
                  <div className="space-y-4">
                    {tutorRequestData.data.bids.map((bid) => (
                      <div key={bid.id} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border border-border">
                            <AvatarImage src={bid.tutor?.avatarUrl || ""} />
                            <AvatarFallback>{bid.tutor?.name?.charAt(0) || "T"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="font-bold text-foreground text-sm">{bid.tutor?.name || "Gia sư"}</h5>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 mt-1">
                              <span className="flex items-center text-yellow-500 font-medium">⭐ {bid.tutor?.rating?.toFixed(1) || "5.0"}</span>
                              <span>•</span>
                              <span>{bid.proposedPrice ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(bid.proposedPrice) : "Thoả thuận"}</span>
                            </div>
                            {bid.message && (
                              <p className="text-sm text-foreground/80 mt-1 italic">&quot;{bid.message}&quot;</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center shrink-0 pt-2 md:pt-0">
                          {bid.status === "ACCEPTED" ? (
                            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                              <CheckCircle2 className="size-4 mr-1.5" />
                              Đã chọn
                            </div>
                          ) : bid.status === "PENDING" && displayStatus === "pending" && role === "student" ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={isAcceptingBid}
                              className="rounded-lg shadow-sm"
                            >
                              Chọn gia sư này
                            </Button>
                          ) : bid.status === "REJECTED" ? (
                            <span className="text-muted-foreground text-sm font-medium">Đã từ chối</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/20 border border-dashed border-border/50 rounded-xl p-8 text-center">
                    <p className="text-muted-foreground text-sm">Chưa có gia sư nào ứng tuyển yêu cầu này.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-border/50">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl px-6 h-11 border-border/50">
              Đóng
            </Button>
          </DialogClose>
          
          {/* Direct Booking Actions (Not TutorRequest) */}
          {!request.isTutorRequest && request.status === "pending" && role === "tutor" && request.type === "received" && (
            <>
              <Button 
                variant="destructive" 
                className="rounded-xl px-6 h-11"
                disabled={isRejecting || isAccepting}
                onClick={handleReject}
              >
                {isRejecting ? "Đang xử lý..." : "Từ chối"}
              </Button>
              <Button 
                className="rounded-xl px-6 h-11 shadow-sm"
                disabled={isRejecting || isAccepting}
                onClick={handleAccept}
              >
                {isAccepting ? "Đang xử lý..." : "Chấp nhận"}
              </Button>
            </>
          )}
          {!request.isTutorRequest && request.status === "pending" && request.type === "sent" && (
            <Button variant="destructive" className="rounded-xl px-6 h-11">
              Hủy yêu cầu
            </Button>
          )}
          {!request.isTutorRequest && request.status === "awaiting_payment" && role === "student" && (
            <Button 
              className="rounded-xl px-6 h-11 bg-purple-600 hover:bg-purple-700 text-white shadow-sm font-semibold"
              onClick={() => {
                const amount = request.price;
                router.push(
                  `/payment/checkout?bookingId=${request.id}&amount=${amount}&courseTitle=Học với gia sư ${request.counterpartName}&courseSubject=${request.courseName}`
                );
              }}
            >
              Thanh toán ngay
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
