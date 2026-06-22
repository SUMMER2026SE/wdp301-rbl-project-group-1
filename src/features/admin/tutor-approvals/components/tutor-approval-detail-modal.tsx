"use client";

import React from "react";
import Modal from "@/src/shared/components/molecules/modal/modal";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import {
  X,
  UserCircle,
  BookOpen,
  GraduationCap,
  DollarSign,
  Clock,
  FileText,
  Check,
  XCircle,
  Eye,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import { Separator } from "@/src/shared/components/ui/separator";
import { Badge } from "@/src/shared/components/ui/badge";
import { toast } from "sonner";
import {
  useApproveTutorApplicationMutation,
  useRejectTutorApplicationMutation,
} from "@/src/features/tutor-application/tutorApplicationApi";
import type { TutorApplication } from "./tutor-approvals.types";

interface TutorApprovalDetailModalProps {
  application: TutorApplication;
  trigger: React.ReactNode;
}

const statusMap: Record<
  TutorApplication["status"],
  { label: string; className: string }
> = {
  PENDING: {
    label: "Đang chờ",
    className: "border-warning/20 bg-warning-soft text-warning",
  },
  APPROVED: {
    label: "Đã duyệt",
    className: "border-success/20 bg-success-soft text-success",
  },
  REJECTED: {
    label: "Từ chối",
    className: "border-error/20 bg-error-soft text-error",
  },
};

const CustomHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between border-b border-border/50 bg-card px-6 py-4 sticky top-0 z-10 w-full">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-xl text-primary">
        <UserCircle className="size-5" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
    </div>
    <DialogClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-90 transition-all"
      >
        <X className="size-4" />
      </Button>
    </DialogClose>
  </div>
);

const getFullFileUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  // Fallback if the path is relative (e.g. from Supabase bucket)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wwfsmxxpvdheypdsgjoo.supabase.co";
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "edura-files";
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${path}`;
};

const FileAttachment = ({ url, index }: { url: string; index: number }) => {
  const fullUrl = getFullFileUrl(url);
  const fileName = url.split("/").pop()?.split("?")[0] || `Tài liệu đính kèm ${index + 1}`;
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
  const isPdf = extension === "pdf";
  const canPreview = isImage || isPdf;

  const handleDownload = () => {
    window.open(fullUrl, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <FileText className="size-4 text-primary shrink-0" />
        <span className="text-sm font-medium text-foreground truncate" title={fileName}>
          {fileName}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {canPreview && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 text-xs rounded-md">
                <Eye className="size-3 mr-1.5" />
                Xem trước
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 overflow-hidden">
              <DialogHeader className="px-4 py-3 border-b bg-muted/30 shrink-0">
                <DialogTitle className="text-sm font-medium truncate">{fileName}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-auto bg-black/5 flex items-center justify-center p-4">
                <DialogDescription className="sr-only">Bản xem trước tệp đính kèm {fileName}</DialogDescription>
                {isImage && (
                  <img 
                    src={fullUrl} 
                    alt={fileName} 
                    className="max-w-full max-h-full object-contain rounded-md shadow-sm"
                  />
                )}
                {isPdf && (
                  <iframe 
                    src={fullUrl} 
                    className="w-full h-full rounded-md border-0 bg-white"
                    title={fileName}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-md" onClick={handleDownload}>
          <Download className="size-3 mr-1.5" />
          Tải xuống
        </Button>
      </div>
    </div>
  );
};

export function TutorApprovalDetailModal({
  application,
  trigger,
}: TutorApprovalDetailModalProps) {
  const [approve, { isLoading: isApproving }] =
    useApproveTutorApplicationMutation();
  const [reject, { isLoading: isRejecting }] =
    useRejectTutorApplicationMutation();

  const isBusy = isApproving || isRejecting;
  const isActionable = application.status === "PENDING";
  const statusMeta = statusMap[application.status];

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(application.createdAt));

  const handleApprove = async () => {
    try {
      await approve({ id: application.id }).unwrap();
      toast.success("Đã phê duyệt gia sư thành công!");
    } catch {
      toast.error("Phê duyệt thất bại. Vui lòng thử lại.");
    }
  };

  const handleReject = async () => {
    try {
      await reject({ id: application.id }).unwrap();
      toast.success("Đã từ chối đơn ứng tuyển.");
    } catch {
      toast.error("Từ chối thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      trigger={trigger}
      title="Chi tiết đơn ứng tuyển gia sư"
      description=""
      formId="tutor-approval-detail-form"
      contentClassName="max-w-3xl sm:max-w-3xl p-0 gap-0 overflow-hidden bg-background rounded-3xl"
      hideDefaultFooter={true}
      customHeader={<CustomHeader title="Chi tiết đơn ứng tuyển gia sư" />}
    >
      <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
        {/* Top Status & Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Ngày gửi
            </p>
            <p className="font-semibold text-foreground">{formattedDate}</p>
          </div>
          <div>
            <Badge
              className={`h-7 rounded-full border px-3 text-sm ${statusMeta.className}`}
            >
              {statusMeta.label}
            </Badge>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 shadow-sm">
          <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
            <AvatarImage src={application.avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
              {application.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {application.specialization || "Gia sư"}
            </h3>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {application.email}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-muted/30">
                Kinh nghiệm:{" "}
                {application.experience
                  ? `${application.experience} năm`
                  : "Chưa cập nhật"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3">
              <GraduationCap className="size-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Học vấn</p>
                <p className="font-semibold text-sm text-foreground">
                  {application.education || "—"}
                </p>
              </div>
            </div>

            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex gap-3">
              <DollarSign className="size-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Học phí mong muốn
                </p>
                <p className="font-semibold text-sm text-foreground">
                  {application.pricePerHour
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(application.pricePerHour) + "/giờ"
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Chuyên môn & Cấp bậc
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="size-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Môn học đăng ký
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {application.subjects && application.subjects.length > 0 ? (
                    application.subjects.map((sub) => (
                      <Badge key={sub.id} variant="secondary">
                        {sub.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Chưa có thông tin
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Lớp/Cấp học
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {application.grades && application.grades.length > 0 ? (
                    application.grades.map((grade) => (
                      <Badge key={grade.id} variant="secondary">
                        {grade.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Chưa có thông tin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Giới thiệu bản thân
            </h4>
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 relative overflow-hidden">
              <div className="z-10 relative">
                {application.bio ? (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {application.bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Không có thông tin giới thiệu.
                  </p>
                )}
              </div>
            </div>
          </div>

          {application.files && application.files.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Tệp đính kèm
                </h4>
                <div className="flex flex-col gap-2">
                  {application.files.map((file, idx) => (
                    <FileAttachment key={idx} url={file} index={idx} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-10 flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-border/50">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-xl px-6 h-11 border-border/50"
              disabled={isBusy}
            >
              Đóng
            </Button>
          </DialogClose>

          {isActionable && (
            <>
              <Button
                variant="destructive"
                className="rounded-xl px-6 h-11 bg-error text-error-foreground hover:bg-error/90"
                disabled={isBusy}
                onClick={handleReject}
              >
                <XCircle className="size-4 mr-2" />
                Từ chối
              </Button>
              <Button
                className="rounded-xl px-6 h-11 bg-success text-success-foreground hover:bg-success/90 shadow-sm"
                disabled={isBusy}
                onClick={handleApprove}
              >
                <Check className="size-4 mr-2" />
                Phê duyệt
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
