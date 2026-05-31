import { RequestsContainer } from "@/src/features/requests/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Yêu cầu | Edura Gia sư",
  description: "Quản lý các yêu cầu đặt lịch dạy và ứng tuyển",
};

export default function TutorRequestsPage() {
  return <RequestsContainer role="tutor" />;
}
