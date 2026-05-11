import type { Tutor } from "./types";

export const MOCK_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Cô Phạm Thu Thủy",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thu+Thuy&background=7C3AED&color=fff",
    isOnline: true,
    rating: 4.9,
    reviewCount: 128,
    specialty: "Chuyên Toán - Hóa cấp 3",
    experience: "10 năm kinh nghiệm",
    education: "Thạc sĩ ĐH Sư Phạm HN",
    pricePerHour: 75000,
    skills: ["Toán 12", "Luyện thi ĐH", "Hóa 12"],
  },
  {
    id: "2",
    name: "Thầy Lê Hoàng",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Hoang&background=3B82F6&color=fff",
    isOnline: false,
    rating: 4.7,
    reviewCount: 89,
    specialty: "Chuyên Tiếng Anh IELTS",
    experience: "5 năm kinh nghiệm",
    education: "Cử nhân Ngoại Thương",
    pricePerHour: 60000,
    skills: ["IELTS 8.0", "Speaking", "Writing"],
  },
  {
    id: "3",
    name: "Trần Minh Quân",
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Minh+Quan&background=10B981&color=fff",
    isOnline: true,
    rating: 4.5,
    reviewCount: 42,
    specialty: "Chuyên Vật lý - Tiếng Anh",
    experience: "5 năm kinh nghiệm",
    education: "SV năm 4 ĐH Bách Khoa",
    pricePerHour: 90000,
    skills: ["Toán 10-12", "Vật lý 12"],
  },
  {
    id: "4",
    name: "Cô Nguyễn Thùy Dương",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Thuy+Duong&background=F59E0B&color=fff",
    isOnline: true,
    rating: 4.8,
    reviewCount: 95,
    specialty: "Tiếng Anh - TOEFL",
    experience: "8 năm kinh nghiệm",
    education: "Bằng TOEFL 110/120",
    pricePerHour: 70000,
    skills: ["TOEFL", "Grammar", "Writing"],
  },
  {
    id: "5",
    name: "Thầy Hoàng Minh Đức",
    avatar:
      "https://ui-avatars.com/api/?name=Hoang+Minh+Duc&background=EF4444&color=fff",
    isOnline: false,
    rating: 4.6,
    reviewCount: 73,
    specialty: "Toán học",
    experience: "7 năm kinh nghiệm",
    education: "Thạc sĩ Toán học",
    pricePerHour: 80000,
    skills: ["Giải tích", "Đại số", "Hình học"],
  },
];

export const TUTORS_DETAIL_DATA: Record<string, Tutor> = {
  "1": {
    id: "1",
    name: "Cô Phạm Thu Thủy",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thu+Thuy&background=7C3AED&color=fff&size=160",
    isOnline: true,
    rating: 4.9,
    reviewCount: 128,
    teachingHours: "1,500+",
    studentCount: "350+",
    specialty: "Chuyên Toán - Hóa cấp 3 | Luyện thi Đại học",
    experience: "10 năm kinh nghiệm",
    education: "Thạc sĩ ĐH Sư Phạm HN",
    pricePerHour: 250000,
    skills: ["Toán 10-12", "Toán 12", "Luyện thi THPTQG"],
    bio: "Chào các em! Cô là Thu Thủy, Thạc sĩ chuyên ngành Phương pháp giảng dạy môn Toán tại Đại học Sư phạm Hà Nội. Với hơn 10 năm kinh nghiệm đứng lớp và gia sư 1 kèm 1, cô luôn tâm niệm: 'Không có học sinh kém, chỉ là chưa tìm được phương pháp học đúng'.\n\nPhương pháp giảng dạy của cô tập trung vào việc lấy học sinh làm trung tâm, khơi gợi niềm đam mê học tập bằng cách liên hệ kiến thức với thực tế. Cô thiết kế lộ trình học cá nhân hóa cho từng bạn, từ lấy lại gốc cho học sinh yếu kém đến nâng cao, luyện thi 9+ cho học sinh khá giỏi.",
    teachingExperience: [
      {
        year: "2018 - Hiện tại",
        position: "Giáo viên Toán",
        school: "THPT Chuyên KHTN",
        description:
          "Giảng dạy môn Toán cho học sinh lớp 10, 11, 12. Luyện thi đội tuyển học sinh giỏi và ôn thi Đại học. Tham gia biên soạn giáo trình và đề thi của trường.",
        isCurrent: true,
      },
      {
        year: "2014 - 2018",
        position: "Gia sư tự do & Giáo viên trung tâm luyện thi",
        school: "Các trung tâm luyện thi Hà Nội",
        description:
          "Dạy kèm 1-1 và dạy nhóm nhỏ môn Toán, Hóa. Luyện thi chuyển cấp vào lớp 10 chuyên và luyện thi THPT Quốc gia.",
      },
    ],
    certifications: [
      {
        name: "Bằng Thạc sĩ Sư phạm Toán",
        issuer: "Đại học Sư phạm Hà Nội",
        year: "2016",
      },
      {
        name: "Chứng chỉ Nghiệp vụ Sư phạm",
        issuer: "Bộ Giáo dục & Đào tạo",
        year: "2014",
      },
    ],
    activeCourses: [
      {
        id: "c1",
        title: "Luyện thi THPT Quốc gia môn Toán",
        image: "https://api.dicebear.com/7.x/abstract/svg?seed=course1",
        lessonCount: 45,
        studentText: "Đang có 3/5 học viên",
        duration: "90 phút/buổi",
        schedule: "Thứ 2, 4, 6",
        price: 1500000,
      },
      {
        id: "c2",
        title: "Lấy lại gốc Toán 11",
        image: "https://api.dicebear.com/7.x/abstract/svg?seed=course2",
        lessonCount: 30,
        studentText: "Tối đa 5 học viên",
        duration: "120 phút/buổi",
        schedule: "Thứ 3, 5, 7",
        price: 1200000,
      },
    ],
    availability: {
      days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      periods: [
        {
          label: "Sáng",
          slots: [false, false, false, false, false, true, true],
        },
        {
          label: "Chiều",
          slots: [false, false, true, false, true, true, false],
        },
        { label: "Tối", slots: [true, false, true, false, true, false, false] },
      ],
    },
    reviews: [
      {
        id: "1",
        studentName: "Lê Lan Anh",
        role: "Học sinh lớp 12 • Toán học",
        rating: 5,
        content:
          "Cô giảng bài rất dễ hiểu, nhiệt tình và luôn giải đáp thắc mắc của em cặn kẽ. Từ một học sinh sợ môn Toán, giờ em đã tự tin giải các dạng bài tập khó. Cảm ơn cô rất nhiều ạ!",
        createdAt: "2 ngày trước",
      },
      {
        id: "2",
        studentName: "Trần Tuấn Minh",
        role: "Phụ huynh • Hóa học 11",
        rating: 5,
        content:
          "Rất hài lòng với kết quả của con sau khi học với cô. Cô không chỉ dạy kiến thức mà còn hướng dẫn phương pháp học tập hiệu quả. Cô là lựa chọn tuyệt vời!",
        createdAt: "1 tuần trước",
      },
      {
        id: "3",
        studentName: "Nguyễn Hà Linh",
        role: "Học sinh lớp 10 • Toán học",
        rating: 4,
        content:
          "Cô rất chuyên nghiệp và có kinh nghiệm. Bài giảng của cô logic, dễ theo dõi. Chỉ mong cô sẽ thêm nhiều bài tập luyện tập hơn.",
        createdAt: "2 tuần trước",
      },
    ],
  },
};
