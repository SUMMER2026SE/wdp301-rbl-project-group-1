"use client";

import type { MultiStepFormStepConfig } from "@/src/shared/components/organisms/multi-step-form/multi-step-form-container";
import { MultiStepFormContainer } from "@/src/shared/components/organisms/multi-step-form/multi-step-form-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import {
  tutorRegistrationSchema,
  type TutorRegistrationData,
} from "../schemas/tutorRegistrationSchemas";

import { TutorBasicInfoForm } from "./tutor-basic-info-form";
import { TutorBenefitsSidebar } from "./tutor-benefits-sidebar";
import { TutorCredentialsForm } from "./tutor-credentials-form";
import { TutorCredentialsSidebar } from "./tutor-credentials-sidebar";
import { TutorExperienceForm } from "./tutor-experience-form";
import { TutorReviewForm } from "./tutor-review-form";

export default function TutorRegistrationContainer() {
  const router = useRouter();

  const methods = useForm<TutorRegistrationData>({
    resolver: zodResolver(tutorRegistrationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      bio: "",
      subjectIds: [],
      gradeIds: [],
      hourlyRate: undefined,
      experience: "",
      achievements: "",
      urls: [""],
      agreedToTerms: false,
      photoFiles: undefined,
      degreeFiles: undefined,
      certificateFiles: undefined,
      identityFiles: undefined,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: TutorRegistrationData) => {
    try {
      // Fake API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Submitted Tutor Data:", data);
      alert(
        "Hồ sơ đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24-48 giờ.",
      );
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const steps: MultiStepFormStepConfig[] = [
    {
      title: "Thông tin cơ bản",
      content: ({ onNext }) => <TutorBasicInfoForm onNext={onNext} />,
      sidebar: <TutorBenefitsSidebar />,
    },
    {
      title: "Bằng cấp & Chứng chỉ",
      content: ({ onNext, onPrevious }) => (
        <TutorCredentialsForm onNext={onNext} onPrevious={onPrevious} />
      ),
      sidebar: <TutorCredentialsSidebar />,
    },
    {
      title: "Kinh nghiệm & Thành tích",
      content: ({ onNext, onPrevious }) => (
        <TutorExperienceForm onNext={onNext} onPrevious={onPrevious} />
      ),
      sidebar: <TutorBenefitsSidebar />,
    },
    {
      title: "Hoàn tất",
      content: ({ onPrevious }) => (
        <TutorReviewForm
          onPrevious={onPrevious}
          onSubmit={methods.handleSubmit(onSubmit)}
        />
      ),
      sidebar: <TutorBenefitsSidebar />,
    },
  ];

  return (
    <FormProvider {...methods}>
      <MultiStepFormContainer title="Đăng ký trở thành Gia sư" steps={steps} />
    </FormProvider>
  );
}
