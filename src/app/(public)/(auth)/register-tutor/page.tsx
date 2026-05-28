import Header from "@/src/features/landing/components/header";
import TutorRegistrationContainer from "@/src/features/tutor-application/components/tutor-registration-container";

export const metadata = {
  title: "Đăng ký Gia sư - Edura",
  description: "Đăng ký trở thành Gia sư tại Edura",
};

export default function RegisterTutorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <TutorRegistrationContainer />
    </div>
  );
}
