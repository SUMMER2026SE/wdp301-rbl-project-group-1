import { BadgeCheck, GraduationCap, Languages } from "lucide-react";

import type { TutorCertificate } from "./tutor-approvals.types";

export const certificateMeta: Record<
  TutorCertificate,
  {
    label: string;
    icon: typeof GraduationCap;
    className: string;
  }
> = {
  degree: {
    label: "Bằng đại học",
    icon: GraduationCap,
    className: "text-success",
  },
  pedagogy: {
    label: "Chứng chỉ sư phạm",
    icon: BadgeCheck,
    className: "text-info",
  },
  language: {
    label: "Chứng chỉ ngoại ngữ",
    icon: Languages,
    className: "text-info",
  },
};
