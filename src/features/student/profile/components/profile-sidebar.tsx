"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Award, Clock, Crown, Flame, Pencil, Timer } from "lucide-react";

export function ProfileSidebar() {
  return (
    <div className="flex w-full flex-col gap-6 lg:w-80 shrink-0">
      {/* Profile Card */}
      <Card className="p-6 flex flex-col items-center text-center bg-card text-card-foreground border border-border shadow-sm">
        <div className="relative mb-4">
          <Avatar className="h-32 w-32 border-4 border-card shadow-md">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback>NVA</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border-2 border-card"
            title="Chỉnh sửa ảnh"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="text-xl font-bold text-foreground">Nguyễn Văn A</h3>
        <p className="text-sm text-primary font-medium mt-1">
          Học sinh - Lớp 12
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
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
              Đang hoạt động
            </Badge>
          </div>
        </div>
      </Card>

      {/* Achievements Card */}
      <Card className="p-6 bg-card text-card-foreground border border-border shadow-sm">
        <h4 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Thành tích học tập
        </h4>

        <div className="mb-5 flex items-center justify-between rounded-lg bg-blue-50/70 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-900">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Tổng giờ học
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors cursor-help"
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors cursor-help"
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors cursor-help"
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
