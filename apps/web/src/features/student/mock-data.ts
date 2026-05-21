import { Course } from "./types";

export const mockCourseDetail: Course = {
  id: "1",
  title: "Toán Hình không gian 12 - Luyện thi Đại học",
  tutorName: "Thầy Nguyễn Văn A",
  tutorAvatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFw1u8sokUlZuCj_LHaYtmATQsk2gCQEKCkbyuIH0RTL8C9BPRZfhjl-T2SN57DBiaTz82K58YnVuIvHuiI1R4KhiwgEWlwmlc2CTqqEcZqtytPa9vviRau3Zcb_-g3XBFLXwrRt3oAcvUjv4POHqQzGKkC6tKi6pIj4khz2JSIaMyN4FNusThStEjvNLR3UO7BoM-m50ywaB5JYU8IqXfMbUSExCtrqf0U_LFnkQhv8DcwtPVRCdlG6EFPAJdjh8CYVB3Rh-RRSg",
  totalLessons: 12,
  completedLessons: 9,
  progress: 75,
  chapters: [
    {
      id: "ch1",
      number: 1,
      title: "Chương 1: Khối đa diện",
      lessons: [
        {
          id: "l1",
          title: "Khái niệm về khối đa diện",
          type: "video",
          duration: "15:20",
          status: "completed",
        },
        {
          id: "l2",
          title: "Khối lăng trụ và khối chóp",
          type: "pdf",
          pageCount: 10,
          status: "completed",
        },
        {
          id: "l3",
          title: "Thể tích khối đa diện",
          type: "video",
          duration: "25:40",
          status: "in-progress",
        },
        {
          id: "l4",
          title: "Luyện tập (Quiz)",
          type: "quiz",
          questionCount: 15,
          status: "locked",
        },
      ],
    },
    {
      id: "ch2",
      number: 2,
      title: "Chương 2: Mặt nón, mặt trụ, mặt cầu",
      lessons: [
        {
          id: "l5",
          title: "Mặt nón và tính chất",
          type: "video",
          duration: "20:15",
          status: "not-started",
        },
        {
          id: "l6",
          title: "Mặt trụ và ứng dụng",
          type: "video",
          duration: "18:30",
          status: "not-started",
        },
        {
          id: "l7",
          title: "Mặt cầu ngoại tiếp",
          type: "pdf",
          pageCount: 12,
          status: "not-started",
        },
        {
          id: "l8",
          title: "Bài tập tổng hợp",
          type: "quiz",
          questionCount: 20,
          status: "not-started",
        },
        {
          id: "l9",
          title: "Đề thi mẫu",
          type: "pdf",
          pageCount: 8,
          status: "not-started",
        },
      ],
    },
    {
      id: "ch3",
      number: 3,
      title: "Chương 3: Phương pháp tọa độ trong không gian",
      lessons: [
        {
          id: "l10",
          title: "Hệ tọa độ Oxyz",
          type: "video",
          duration: "22:10",
          status: "not-started",
        },
        {
          id: "l11",
          title: "Phương trình mặt phẳng",
          type: "video",
          duration: "28:45",
          status: "not-started",
        },
        {
          id: "l12",
          title: "Phương trình đường thẳng",
          type: "video",
          duration: "26:30",
          status: "not-started",
        },
      ],
    },
  ],
  onlineClass: {
    platform: "Google Meet",
    schedule: "Thứ 3, Thứ 5 hàng tuần - 19:30 - 21:00",
    meetLink: "https://meet.google.com",
  },
  relatedDocuments: [
    {
      id: "doc1",
      name: "Bài tập trắc nghiệm Khối đa diện.pdf",
      size: "2.4 MB",
      url: "#",
    },
    {
      id: "doc2",
      name: "Công thức tính nhanh Thể tích.pdf",
      size: "1.1 MB",
      url: "#",
    },
  ],
};
