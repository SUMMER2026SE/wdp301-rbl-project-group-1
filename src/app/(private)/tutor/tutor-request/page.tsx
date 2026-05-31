import { TutorRequestContainer } from "@/src/features/tutor/tutor-request/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yêu cầu Tìm Gia sư | Edura",
  description: "Danh sách các yêu cầu tìm gia sư từ học sinh",
};

export default function TutorRequestPage() {
  return <TutorRequestContainer />;
}
