"use client";

import { toast } from "sonner";

import type { MultiStepFormStepConfig } from "@/src/shared/components/organisms/multi-step-form/multi-step-form-container";
import { MultiStepFormContainer } from "@/src/shared/components/organisms/multi-step-form/multi-step-form-container";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import {
  tutorRegistrationSchema,
  type TutorRegistrationData,
} from "../schemas/tutorRegistrationSchemas";

import {
  useStorageControllerPresignMutation,
  useStorageControllerUploadImageMutation,
} from "@/src/features/storage/storageApi";
import { useCreateTutorApplicationMutation } from "../tutorApplicationApi";
import { TutorBasicInfoForm } from "./tutor-basic-info-form";
import { TutorBenefitsSidebar } from "./tutor-benefits-sidebar";
import { TutorCredentialsForm } from "./tutor-credentials-form";
import { TutorCredentialsSidebar } from "./tutor-credentials-sidebar";
import { TutorExperienceForm } from "./tutor-experience-form";
import { TutorReviewForm } from "./tutor-review-form";

interface UploadImageResponse {
  data?: { secure_url: string };
  secure_url?: string;
}

interface PresignResponse {
  data?: { signedUrl: string; path: string };
  signedUrl?: string;
  path?: string;
}

export default function TutorRegistrationContainer() {
  const router = useRouter();

  const methods = useForm<TutorRegistrationData>({
    resolver: zodResolver(tutorRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
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

  const [createApplication] = useCreateTutorApplicationMutation();
  const [uploadImage] = useStorageControllerUploadImageMutation();
  const [presignUrl] = useStorageControllerPresignMutation();

  const onSubmit = async (data: TutorRegistrationData) => {
    try {
      let avatarUrl: string | undefined = undefined;
      const files: string[] = [];

      if (data.photoFiles) {
        const formData = new FormData();
        formData.append("file", data.photoFiles as Blob);
        const res = (await uploadImage({
          body: formData as unknown as { file?: Blob },
        }).unwrap()) as UploadImageResponse;
        avatarUrl = res?.data?.secure_url || res?.secure_url;
      }

      const uploadDocument = async (file: File) => {
        const res = (await presignUrl({
          presignDto: { filename: file.name, folder: "tutor-applications" },
        }).unwrap()) as PresignResponse;
        const presignData = res?.data || res;

        if (presignData?.signedUrl) {
          await fetch(presignData.signedUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });
        }
        return presignData?.path || "";
      };

      if (data.degreeFiles) {
        files.push(await uploadDocument(data.degreeFiles as File));
      }
      if (data.certificateFiles) {
        files.push(await uploadDocument(data.certificateFiles as File));
      }
      if (data.identityFiles) {
        files.push(await uploadDocument(data.identityFiles as File));
      }

      await createApplication({
        createTutorApplicationDto: {
          email: data.email,
          phone: data.phone,
          address: data.address || undefined,
          specialization: data.fullName, 
          bio: data.bio || undefined,
          experience: data.experience ? 1 : undefined, 
          education: (data.degreeFiles as File)?.name || undefined,
          pricePerHour: data.hourlyRate || undefined,
          subjectIds: data.subjectIds,
          gradeIds: data.gradeIds,
          avatarUrl,
          files,
        },
      }).unwrap();

      toast.success(
        "Hồ sơ đã được gửi thành công! Vui lòng xác thực email.",
      );
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=verify-email`);
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
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
