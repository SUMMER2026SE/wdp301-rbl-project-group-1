"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { TutorRegistrationData } from "../schemas/tutorRegistrationSchemas";

interface TutorBasicInfoFormProps {
  onNext: () => void;
}

export function TutorBasicInfoForm({ onNext }: TutorBasicInfoFormProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<TutorRegistrationData>();
  const bioValue = watch("bio") || "";
  const [charCount, setCharCount] = useState(bioValue.length);

  const handleNext = async () => {
    const isValid = await trigger([
      "fullName",
      "phone",
      "bio",
      "subject",
      "hourlyRate",
    ]);
    if (isValid) {
      onNext();
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setCharCount(value.length);
      setValue("bio", value, { shouldValidate: true });
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 sm:p-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Thông tin cơ bản
      </h2>
      <p className="text-muted-foreground mb-8">
        Hãy cho chúng tôi biết về bạn. Thông tin này sẽ được hiển thị trên hồ sơ
        công khai của bạn để học sinh có thể tìm hiểu thêm về bạn.
      </p>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-input flex flex-col items-center justify-center text-muted-foreground shrink-0 cursor-pointer hover:bg-muted/80 transition-colors">
            <svg
              className="w-10 h-10 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs font-medium">Tải ảnh lên</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground mb-2">
              Ảnh chân dung chuyên nghiệp
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tải lên một bức ảnh rõ nét, chụp chính diện với khuôn mặt của bạn.
              Ảnh chụp chuyên nghiệp sẽ giúp bạn tạo ấn tượng tốt hơn với học
              viên.
            </p>
            <div className="text-xs text-muted-foreground">
              Định dạng hỗ trợ: JPG, PNG, tối đa 5MB.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-bold text-foreground mb-2"
            >
              Họ và Tên
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              className="h-12 rounded-xl"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-bold text-foreground mb-2"
            >
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912 345 678"
              className="h-12 rounded-xl"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="bio"
            className="text-sm font-bold text-foreground mb-2"
          >
            Bio giới thiệu (Tiểu sử)
          </Label>
          <Textarea
            id="bio"
            placeholder="Viết một đoạn ngắn giới thiệu về bản thân, kinh nghiệm giảng dạy và phương pháp sư phạm của bạn..."
            className="min-h-[120px] rounded-xl"
            maxLength={500}
            value={bioValue}
            onChange={handleBioChange}
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {charCount}/500 ký tự
          </p>
          {errors.bio && (
            <p className="text-xs text-destructive mt-1">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="subject"
            className="text-sm font-bold text-foreground mb-2"
          >
            Môn học giảng dạy
          </Label>
          <Select
            value={watch("subject")}
            onValueChange={(val) =>
              setValue("subject", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="-- Chọn môn học --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toan">Toán học</SelectItem>
              <SelectItem value="ly">Vật lý</SelectItem>
              <SelectItem value="hoa">Hóa học</SelectItem>
              <SelectItem value="anh">Tiếng Anh</SelectItem>
              <SelectItem value="tin">Tin học</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-xs text-destructive mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="hourlyRate"
            className="text-sm font-bold text-foreground mb-2"
          >
            Học phí mong muốn (VNĐ/giờ)
          </Label>
          <div className="relative border rounded-xl focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <Input
              id="hourlyRate"
              type="number"
              placeholder="200000"
              className="h-12 border-0 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              {...register("hourlyRate", { valueAsNumber: true })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium bg-transparent pointer-events-none">
              VNĐ
            </span>
          </div>
          {errors.hourlyRate && (
            <p className="text-xs text-destructive mt-1">
              {errors.hourlyRate.message}
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <Button
            type="button"
            onClick={handleNext}
            size="lg"
            className="rounded-xl shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
          >
            Tiếp theo
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
