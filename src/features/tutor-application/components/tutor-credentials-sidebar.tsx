import { CREDENTIALS_NOTES } from "@/src/features/tutor-application/constants/constants";
import { Button } from "@/src/shared/components/ui/button";

export function TutorCredentialsSidebar() {
  const FileIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );

  const FileSizeIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
    </svg>
  );

  const EyeIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  const iconMap = [FileIcon, FileSizeIcon, EyeIcon, ShieldIcon];

  const notes = CREDENTIALS_NOTES.map((note, index) => ({
    ...note,
    icon: iconMap[index] ? iconMap[index]() : null,
  }));

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6">
      <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Lưu ý về hồ sơ
        </h3>
        <ul className="space-y-4">
          {notes.map((note, index) => (
            <li key={index} className="flex gap-3 items-start">
              <div className="mt-0.5 size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                {note.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {note.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {note.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-background rounded-2xl p-6 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-2">Cần hỗ trợ?</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình đăng
          ký.
        </p>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-background border border-input text-foreground text-sm font-bold hover:bg-muted transition-colors"
        >
          <svg
            className="w-[18px] h-[18px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Chat với hỗ trợ viên
        </Button>
      </div>
    </div>
  );
}
