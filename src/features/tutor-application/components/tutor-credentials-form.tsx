import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/src/shared/components/ui/button";
import { FileUpload } from "@/src/shared/components/molecules/file-upload/file-upload";
import type { TutorRegistrationData } from "../schemas/tutorRegistrationSchemas";

interface TutorCredentialsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function TutorCredentialsForm({
  onNext,
  onPrevious,
}: TutorCredentialsFormProps) {
  const { control } = useFormContext<TutorRegistrationData>();

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 sm:p-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Bằng cấp & Chứng chỉ
      </h2>
      <p className="text-muted-foreground mb-8">
        Tải lên các tài liệu xác thực để chứng minh năng lực và trình độ của
        bạn. Hồ sơ có đầy đủ bằng cấp sẽ nhận được nhiều sự tin tưởng hơn từ học
        viên.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-bold text-foreground mb-2">
            Bằng cấp cao nhất (Đại học/Thạc sĩ) *
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Bản scan hoặc ảnh chụp rõ nét bằng tốt nghiệp của bạn.
          </p>
          <Controller
            control={control}
            name="degreeFiles"
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            )}
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-2">
            Chứng chỉ chuyên môn / Ngoại ngữ
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Các chứng chỉ như IELTS, TOEFL, JLPT, HSK hoặc chứng chỉ sư phạm...
          </p>
          <Controller
            control={control}
            name="certificateFiles"
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            )}
          />
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-2">
            Giấy tờ định danh / Thẻ ngành *
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Thẻ sinh viên, Thẻ giáo viên hoặc CCCD/CMND để xác thực danh tính.
          </p>
          <Controller
            control={control}
            name="identityFiles"
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            )}
          />
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
            onClick={onNext}
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
