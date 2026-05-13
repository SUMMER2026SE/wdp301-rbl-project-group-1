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
