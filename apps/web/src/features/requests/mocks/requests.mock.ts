export type RequestStatus = "pending" | "accepted" | "rejected" | "completed" | "awaiting_payment" | "confirmed";

export interface BookingRequest {
  id: string;
  counterpartName: string; // The other person (Tutor name if I'm student, Student name if I'm tutor)
  counterpartAvatar: string;
  courseName: string;
  createdAt: string;
  schedule: string;
  price: number;
  status: RequestStatus;
  message?: string;
  type: "sent" | "received"; // from the perspective of the current user
  isTutorRequest?: boolean; // True if this is a general tutor request rather than a direct booking
}

export const MOCK_STUDENT_REQUESTS: BookingRequest[] = [
  {
    id: "req-101",
    type: "sent",
    counterpartName: "Cô Nguyễn Trà My",
    counterpartAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=My",
    courseName: "Luyện thi THPT Quốc Gia môn Toán",
    createdAt: "2024-05-30T08:30:00Z",
    schedule: "T3, T5 (19:00 - 20:30)",
    price: 350000,
    status: "pending",
    message: "Em muốn đăng ký học ngay tuần sau ạ.",
  },
  {
    id: "req-102",
    type: "sent",
    counterpartName: "Thầy Lê Văn Hùng",
    counterpartAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Hung",
    courseName: "Vật lý lớp 11 Căn bản",
    createdAt: "2024-05-28T14:15:00Z",
    schedule: "T2, T6 (18:00 - 19:30)",
    price: 250000,
    status: "accepted",
  },
  {
    id: "req-103",
    type: "received",
    counterpartName: "Gia sư Tiếng Anh IELTS",
    counterpartAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=IELTS",
    courseName: "Lời mời học thử IELTS 6.5",
    createdAt: "2024-05-25T09:00:00Z",
    schedule: "T7 (15:00 - 16:30)",
    price: 0,
    status: "completed",
    message: "Chào bạn, mình thấy bạn đang tìm gia sư IELTS. Bạn có muốn học thử 1 buổi không?",
  }
];

export const MOCK_TUTOR_REQUESTS: BookingRequest[] = [
  {
    id: "req-201",
    type: "received",
    counterpartName: "Trần Bảo Nam",
    counterpartAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nam",
    courseName: "Toán 12 Nâng cao",
    createdAt: "2024-05-31T10:20:00Z",
    schedule: "CN (08:00 - 10:00)",
    price: 400000,
    status: "pending",
    message: "Thầy cho em hỏi khóa này còn nhận học viên không ạ?",
  },
  {
    id: "req-202",
    type: "received",
    counterpartName: "Lê Ngọc Linh",
    counterpartAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Linh2",
    courseName: "Luyện đề Toán THPT",
    createdAt: "2024-05-29T16:45:00Z",
    schedule: "T3, T5, T7 (19:30 - 21:00)",
    price: 350000,
    status: "accepted",
  },
  {
    id: "req-203",
    type: "sent",
    counterpartName: "Phạm Hoàng Sơn",
    counterpartAvatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Son",
    courseName: "Đề nghị dạy kèm theo yêu cầu",
    createdAt: "2024-05-20T11:00:00Z",
    schedule: "T4 (18:00 - 20:00)",
    price: 300000,
    status: "rejected",
  }
];
