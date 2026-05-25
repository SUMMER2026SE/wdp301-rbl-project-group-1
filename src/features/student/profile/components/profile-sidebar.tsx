"use client";

import {
  useChangeAvatarMutation,
  useGetProfileQuery,
} from "@/src/features/user/userApi";
import { AvatarUpload } from "@/src/shared/components/molecules/avatar-upload/avatar-upload";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { Spinner } from "@/src/shared/components/ui/spinner";
import { useAppSelector } from "@/src/shared/store/hooks";
import { getSummaryName } from "@/src/shared/utils/common";
import { Award, Clock, Crown, Flame, Pencil, Timer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProfileSidebar() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data, refetch } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [changeAvatar, { isLoading: isUpdatingAvatar }] =
    useChangeAvatarMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userProfile = data?.data?.profile;
  const studentInfo = data?.data?.student;

  const displayName = userProfile?.nickname ?? "Nguyễn Văn A";
  const initials = getSummaryName(displayName);
  const avatarUrl = userProfile?.avatarUrl || undefined;
  const gradeLabel = studentInfo?.grades?.[0]?.name ?? "Lớp 12";

  const uploadAvatar = async (file: File) => {
    await changeAvatar({ body: { avatar: file } }).unwrap();
  };

  const handleAvatarSave = async () => {
    if (!avatarFile) {
      toast.error("Vui lòng chọn ảnh đại diện trước khi lưu.");
      return;
    }

    try {
      await uploadAvatar(avatarFile);
      toast.success("Cập nhật ảnh đại diện thành công!");
      setAvatarFile(null);
      setIsDialogOpen(false);
      await refetch();
    } catch {
      toast.error("Cập nhật ảnh thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:w-80 shrink-0">
      {/* Profile Card */}
      <Card className="p-6 flex flex-col items-center text-center bg-card text-card-foreground border border-border shadow-sm">
        <div className="relative mb-4">
          <Avatar className="h-32 w-32 border-4 border-card shadow-md">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setAvatarFile(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border-2 border-card"
                title="Chỉnh sửa ảnh"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <AvatarUpload value={avatarFile} onChange={setAvatarFile} />
                <p className="text-xs text-muted-foreground">
                  Chọn ảnh JPG/PNG, tối đa 5MB.
                </p>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleAvatarSave}
                  disabled={isUpdatingAvatar}
                >
                  {isUpdatingAvatar ? <Spinner /> : "Lưu ảnh"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
        <p className="text-sm text-primary font-medium mt-1">
          Học sinh - {gradeLabel}
        </p>

        <div className="mt-4 w-full flex flex-col gap-2 rounded-lg bg-muted p-4 text-left border border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Mã học sinh:</span>
            <span className="text-sm font-semibold text-foreground">
              HS-2023-8942
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Trạng thái:</span>
            <Badge className="bg-success-soft text-success hover:bg-success-soft border-none">
              Đang hoạt động
            </Badge>
          </div>
        </div>
      </Card>

      {/* Achievements Card */}
      <Card className="p-6 bg-card text-card-foreground border border-border shadow-sm">
        <h4 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Thành tích học tập
        </h4>

        <div className="mb-5 flex items-center justify-between rounded-lg bg-info-soft p-4 border border-info/10">
          <div>
            <p className="text-xs font-medium text-info uppercase tracking-wider">
              Tổng giờ học
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              124
              <span className="text-sm font-normal text-muted-foreground ml-1">
                giờ
              </span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-primary shadow-sm border border-border">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">
            Huy hiệu đạt được
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 group">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-soft text-warning group-hover:opacity-80 transition-colors cursor-help"
                title="Chăm chỉ: Hoàn thành 50 buổi học"
              >
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground text-center">
                Chăm chỉ
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-soft text-primary group-hover:opacity-80 transition-colors cursor-help"
                title="Học bá: Đạt điểm A trong 5 bài kiểm tra"
              >
                <Crown className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground text-center">
                Học bá
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success group-hover:opacity-80 transition-colors cursor-help"
                title="Đúng giờ: Không đến muộn trong 30 buổi"
              >
                <Timer className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground text-center">
                Đúng giờ
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
