export type TutorRequestStatus = "open" | "closed" | "in_progress";

export interface TutorRequest {
  id: string;
  title: string;
  studentName: string;
  studentAvatar: string;
  createdAt: string;
  status: TutorRequestStatus;
  description: string;
  pricePerSession: number;
  sessionsPerWeek: number;
  format: string; // e.g., "Online", "Offline", "Quận 1, TP.HCM / Online"
  subject: string;
  level: string;
}

export const MOCK_TUTOR_REQUESTS: TutorRequest[] = [
  {
    id: "req-1",
    title: "Grade 12 Math Review",
    studentName: "Nguyễn Minh Anh",
    studentAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=MinhAnh",
    createdAt: "12/05/2024",
    status: "open",
    description:
      "Em đang cần ôn tập cấp tốc các chuyên đề Hàm số và Hình học không gian để chuẩn bị cho kỳ thi THPT Quốc gia. Cần gia sư có kinh nghiệm luyện thi.",
    pricePerSession: 350000,
    sessionsPerWeek: 2,
    format: "Quận 1, TP.HCM / Online",
    subject: "Toán học",
    level: "Cấp 3",
  },
  {
    id: "req-2",
    title: "IELTS Speaking 1-on-1",
    studentName: "Trần Văn Hoàng",
    studentAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Hoang",
    createdAt: "14/05/2024",
    status: "open",
    description:
      "Mục tiêu đạt 7.5 IELTS. Tập trung vào kỹ năng Speaking, sửa lỗi phát âm và phát triển ý tưởng linh hoạt. Ưu tiên gia sư đã có chứng chỉ 8.0+.",
    pricePerSession: 500000,
    sessionsPerWeek: 3,
    format: "Học Online qua Zoom",
    subject: "Tiếng Anh",
    level: "IELTS/TOEIC",
  },
  {
    id: "req-3",
    title: "Lấy gốc Vật lý 10",
    studentName: "Lê Ngọc Linh",
    studentAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Linh",
    createdAt: "15/05/2024",
    status: "in_progress",
    description:
      "Con tôi học hơi yếu môn Vật Lý năm lớp 10. Cháu chưa hiểu sâu bản chất nên làm bài tập còn lúng túng. Tôi cần tìm một gia sư kiên nhẫn, có thể dạy lại từ căn bản.",
    pricePerSession: 200000,
    sessionsPerWeek: 2,
    format: "Quận Cầu Giấy, Hà Nội",
    subject: "Vật lý",
    level: "Cấp 3",
  },
  {
    id: "req-4",
    title: "Luyện viết Ngữ Văn thi HSG",
    studentName: "Phạm Phương Thảo",
    studentAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Thao",
    createdAt: "18/05/2024",
    status: "open",
    description:
      "Em cần người đồng hành để luyện kỹ năng viết Nghị luận văn học và Nghị luận xã hội chuyên sâu, chuẩn bị cho kỳ thi học sinh giỏi cấp Thành phố.",
    pricePerSession: 400000,
    sessionsPerWeek: 1,
    format: "Học Online qua Google Meet",
    subject: "Ngữ văn",
    level: "Cấp 2",
  },
];
