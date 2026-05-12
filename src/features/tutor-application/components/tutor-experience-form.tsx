import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { TutorRegistrationData } from "../schemas/tutorRegistrationSchemas";

interface TutorExperienceFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function TutorExperienceForm({
  onNext,
  onPrevious,
}: TutorExperienceFormProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<TutorRegistrationData>();

  const experienceValue = watch("experience") || "";
  const [experienceCount, setExperienceCount] = useState(
    experienceValue.length,
  );

  // Since react-hook-form doesn't provide useFieldArray for primitive arrays,
  // we will manually manage the urls array for simplicity.
  const urls = watch("urls") || [""];

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setExperienceCount(value.length);
      setValue("experience", value, { shouldValidate: true });
    }
  };

  const handleAddUrl = () => {
    setValue("urls", [...urls, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setValue("urls", newUrls.length ? newUrls : [""]);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setValue("urls", newUrls);
  };

  const handleNext = async () => {
    const isValid = await trigger(["experience", "achievements", "urls"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border p-6 sm:p-10">
      <h2 className="text-2xl font-bold mb-6">Kinh nghiệm & Thành tích</h2>
      <p className="text-muted-foreground mb-8">
        Chia sẻ quá trình giảng dạy và những thành tựu nổi bật của bạn. Đây là
        yếu tố quan trọng giúp học sinh quyết định chọn bạn làm gia sư.
      </p>

      <div className="space-y-8">
        <div>
          <Label htmlFor="experience" className="text-sm font-bold mb-2">
            Kinh nghiệm giảng dạy
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Mô tả chi tiết các kinh nghiệm bạn đã có (ví dụ: gia sư tự do, trung
            tâm luyện thi, trợ giảng...). Ghi rõ môn học và độ tuổi học sinh.
          </p>
          <Textarea
            id="experience"
            placeholder={`- Từng làm gia sư tự do môn Toán lớp 9 (2 năm)
- Trợ giảng tại trung tâm Tiếng Anh ABC (1 năm)
- Dạy kèm nhóm nhỏ 3-5 học sinh ôn thi Đại học...`}
            className="min-h-[160px] rounded-xl"
            maxLength={1000}
            value={experienceValue}
            onChange={handleExperienceChange}
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {experienceCount}/1000 ký tự
          </p>
          {errors.experience && (
            <p className="text-xs text-destructive mt-1">
              {errors.experience.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="achievements" className="text-sm font-bold mb-2">
            Thành tích nổi bật
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Những thành tựu bạn đạt được trong học tập hoặc kết quả học tập của
            các học sinh cũ (nếu có).
          </p>
          <Textarea
            id="achievements"
            placeholder={`- Giải Nhì kỳ thi Học sinh giỏi cấp Tỉnh môn Toán (2020)
- Giúp 2 học sinh đỗ trường THPT chuyên Nguyễn Huệ
- Đạt 8.0 IELTS...`}
            className="min-h-[120px] rounded-xl"
            {...register("achievements")}
          />
          {errors.achievements && (
            <p className="text-xs text-destructive mt-1">
              {errors.achievements.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm font-bold mb-2">
            Liên kết (URL) liên quan
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Thêm link dẫn đến portfolio cá nhân, trang LinkedIn, hoặc bài viết
            liên quan đến kinh nghiệm của bạn.
          </p>

          <div className="space-y-3">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="w-full h-12 rounded-xl"
                  />
                  {errors.urls?.[index] && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.urls[index]?.message}
                    </p>
                  )}
                </div>
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveUrl(index)}
                    className="w-12 h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="link"
              onClick={handleAddUrl}
              className="flex items-center gap-2 px-0 text-sm font-bold text-primary hover:text-primary transition-colors bg-transparent hover:bg-transparent"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm liên kết khác
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-between items-center">
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
