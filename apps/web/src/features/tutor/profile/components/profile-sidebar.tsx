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
import { Clock, Pencil, Star, Users } from "lucide-react";
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
  const tutorInfo = data?.data?.tutor;

  const displayName = userProfile?.nickname ?? "Gia sư";
  const initials = getSummaryName(displayName);
  const avatarUrl = userProfile?.avatarUrl || undefined;
  const specializationLabel = tutorInfo?.specialization ?? "Giáo viên";

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
          {specializationLabel}
        </p>

        <div className="mt-4 w-full flex flex-col gap-2 rounded-lg bg-muted p-4 text-left border border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Mã gia sư:</span>
            <span className="text-sm font-semibold text-foreground">
              GS-{data?.data?.id?.substring(0, 8) ?? "2023"}
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

      {/* Stats Card */}
      <Card className="p-6 bg-card text-card-foreground border border-border shadow-sm">
        <h4 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-warning" />
          Thống kê giảng dạy
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-sm text-foreground">Đánh giá</span>
            </div>
            <span className="text-sm font-bold">{tutorInfo?.rating ?? 0}/5</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-info" />
              <span className="text-sm text-foreground">Học sinh</span>
            </div>
            <span className="text-sm font-bold">{tutorInfo?.studentCount ?? 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-sm text-foreground">Giờ giảng dạy</span>
            </div>
            <span className="text-sm font-bold">120+</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
