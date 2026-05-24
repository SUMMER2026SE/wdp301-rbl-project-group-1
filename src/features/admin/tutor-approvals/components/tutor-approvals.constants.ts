import { BadgeCheck, GraduationCap, Languages } from "lucide-react";

import type { TutorApplication, TutorCertificate } from "./tutor-approvals.types";

export const tutorApplications: TutorApplication[] = [
  {
    name: "Nguyễn Thị A",
    email: "nguyenthia@email.com",
    subjects: ["Toán học", "Cấp 3"],
    certificates: ["degree", "pedagogy"],
    submittedAt: "24/10/2023",
  },
  {
    name: "Trần Văn B",
    email: "tranvanb@email.com",
    subjects: ["Vật lý", "Cấp 2, Cấp 3"],
    certificates: ["degree"],
    submittedAt: "23/10/2023",
  },
  {
    name: "Lê Thị C",
    email: "lethic@email.com",
    subjects: ["Tiếng Anh", "IELTS"],
    certificates: ["language", "degree"],
    submittedAt: "22/10/2023",
  },
];

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
