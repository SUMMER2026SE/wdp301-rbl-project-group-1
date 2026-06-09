import { RequestsContainer } from "@/src/features/requests/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Yêu cầu | Edura",
  description: "Quản lý các yêu cầu đặt lịch học và khóa học của bạn",
};

export default function StudentRequestsPage() {
  return <RequestsContainer role="student" />;
}
