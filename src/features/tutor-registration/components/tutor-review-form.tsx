"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/src/shared/components/ui/button";
import type { TutorRegistrationData } from "../schemas/tutorRegistrationSchemas";

interface TutorReviewFormProps {
  onPrevious: () => void;
  onSubmit: () => void;
}

export function TutorReviewForm({
  onPrevious,
  onSubmit,
}: TutorReviewFormProps) {
  const {
    watch,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TutorRegistrationData>();
  const agreedToTerms = watch("agreedToTerms");

  const formData = watch();

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 sm:p-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Hoàn tất & Kiểm tra
      </h2>
      <p className="text-muted-foreground mb-8">
        Vui lòng kiểm tra lại toàn bộ thông tin đã nhập trước khi gửi hồ sơ phê
        duyệt. Bạn có thể chỉnh sửa lại các thông tin nếu cần thiết.
      </p>

      <div className="space-y-8">
        <div className="border border-border rounded-xl p-6 relative">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              1
            </div>
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Họ và Tên</p>
              <p className="font-medium text-foreground">{formData.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Số điện thoại
              </p>
              <p className="font-medium text-foreground">{formData.phone}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Môn học giảng dạy
              </p>
              <p className="font-medium text-foreground">{formData.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Học phí mong muốn
              </p>
              <p className="font-medium text-foreground">
                {formData.hourlyRate?.toLocaleString("vi-VN")} VNĐ/giờ
              </p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-xs text-muted-foreground mb-1">
                Bio giới thiệu
              </p>
              <p className="text-sm text-foreground">
                {formData.bio || "Không có"}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 relative">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              2
            </div>
            Bằng cấp & Chứng chỉ
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Hồ sơ đã được đính kèm.
              </span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 relative">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              3
            </div>
            Kinh nghiệm & Thành tích
          </h3>
          <div className="space-y-4">
            <div>
              <p className="font-bold text-foreground text-sm">Kinh nghiệm</p>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {formData.experience || "Không có"}
              </p>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">
                Thành tích nổi bật
              </p>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {formData.achievements || "Không có"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <label className="flex items-start gap-3 cursor-pointer mb-2">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register("agreedToTerms")}
                className="w-5 h-5 rounded border-input text-primary focus:ring-ring cursor-pointer"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Bằng việc nhấn Gửi, bạn đồng ý với các{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                điều khoản dành cho đối tác gia sư
              </a>{" "}
              và{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                chính sách bảo mật
              </a>{" "}
              của chúng tôi.
            </div>
          </label>
          {errors.agreedToTerms && (
            <p className="text-xs text-destructive mb-6">
              {errors.agreedToTerms.message}
            </p>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              onClick={onPrevious}
              variant="outline"
              size="lg"
              className="rounded-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!agreedToTerms || isSubmitting}
              size="lg"
              className="rounded-xl shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {isSubmitting ? "Đang gửi..." : "Gửi hồ sơ phê duyệt"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
