"use client";

import { Button } from "@/src/shared/components/ui/button";

interface TutorCredentialsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function TutorCredentialsForm({
  onNext,
  onPrevious,
}: TutorCredentialsFormProps) {
  // Currently mocked file uploads as per edura-ui. In future this can integrate with upload endpoints.
  const degreeFile = {
    name: "Bang-Tot-Nghiep-DH.pdf",
    size: "2.4 MB",
    type: "pdf" as const,
  };
  const identityFile = {
    name: "The-Sinh-Vien-Mat-Truoc.jpg",
    size: "1.2 MB",
    type: "image" as const,
  };

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

          <div className="relative w-full rounded-xl border border-border bg-muted/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                  {degreeFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {degreeFile.size}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full bg-background border border-input flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/20 hover:bg-destructive/10 transition-colors"
            >
              <svg
                className="w-4 h-4"
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
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-2">
            Chứng chỉ chuyên môn / Ngoại ngữ
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Các chứng chỉ như IELTS, TOEFL, JLPT, HSK hoặc chứng chỉ sư phạm...
          </p>
          <div className="w-full rounded-xl border-2 border-dashed border-input bg-muted/50 p-8 flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-foreground mb-1">
              Nhấn để tải lên hoặc kéo thả file vào đây
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Hỗ trợ PDF, JPG, PNG (Tối đa 5MB)
            </p>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-4 rounded-lg bg-background border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Chọn file
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-2">
            Giấy tờ định danh / Thẻ ngành *
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Thẻ sinh viên, Thẻ giáo viên hoặc CCCD/CMND để xác thực danh tính.
          </p>

          <div className="relative w-full rounded-xl border border-border bg-muted/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                  {identityFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {identityFile.size}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full bg-background border border-input flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/20 hover:bg-destructive/10 transition-colors"
            >
              <svg
                className="w-4 h-4"
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
