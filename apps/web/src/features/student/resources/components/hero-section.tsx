"use client";

import { Button } from "@/src/shared/components/ui/button";
import { CloudUpload } from "lucide-react";

interface HeroSectionProps {
  onUploadClick?: () => void;
}

export function HeroSection({ onUploadClick }: HeroSectionProps) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl">
          Thư viện Tài liệu
        </h1>
        <p className="max-w-2xl text-base font-normal leading-normal text-muted-foreground">
          Khám phá hàng ngàn tài liệu học tập, sách giáo khoa, và đề thi được
          cập nhật liên tục để hỗ trợ quá trình ôn luyện của bạn.
        </p>
      </div>
      <Button
        className="hidden items-center gap-2 sm:flex"
        onClick={onUploadClick}
      >
        <CloudUpload className="size-5" />
        Tải lên tài liệu
      </Button>
    </div>
  );
}
