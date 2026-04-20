import { TUTOR_BENEFITS } from "@/src/features/tutor-registration/constants/constants";
import { Button } from "@/src/shared/components/ui/button";

export function TutorBenefitsSidebar() {
  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const benefits = TUTOR_BENEFITS.map((benefit) => ({
    ...benefit,
    icon: <CheckIcon />,
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
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          Tại sao nên tham gia?
        </h3>
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex gap-3 items-start">
              <div className="mt-0.5 size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {benefit.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {benefit.description}
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
