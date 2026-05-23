import type { Course } from "./types";

// TODO: Replace with RTK Query hook
// import { useGetCoursesQuery } from "@/src/features/courses/coursesApi";
// Generated via: yarn generate:api (or npm run generate:api)
// Expected endpoint: GET /courses?page=&limit=&subjects=&formats=&priceMin=&priceMax=&rating=&search=&sortBy=

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Vật Lý 12 - Chinh phục điểm 9+",
    description:
      "Khóa học nâng cao dành cho học sinh lớp 12, vận dụng cao trong đề thi Đại học. Phương pháp giải nhanh, tư duy logic.",
    subject: "Vật lý",
    level: "Cấp 3",
    format: "online",
    instructor: {
      id: "t1",
      name: "Thầy Trần Minh Quân",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Tran+Minh+Quan&background=6366f1&color=fff",
      role: "Gia sư Vật lý",
    },
    rating: 4.8,
    reviewCount: 234,
    studentCount: 1820,
    price: 650000,
    status: "hot",
  },
  {
    id: "2",
    title: "IELTS Target 7.5+ Masterclass",
    description:
      "Nâng cao 4 kỹ năng Nghe, Nói, Đọc, Viết với lộ trình chuẩn từ nền tảng đến band 7.5 cùng giảng viên kinh nghiệm.",
    subject: "Tiếng Anh",
    level: "IELTS/TOEIC",
    format: "online",
    instructor: {
      id: "t2",
      name: "Thầy Lê Hoàng",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Le+Hoang&background=10b981&color=fff",
      role: "Giảng viên IELTS",
    },
    rating: 4.9,
    reviewCount: 512,
    studentCount: 3240,
    price: 1250000,
    status: "suggested",
  },
  {
    id: "3",
    title: "Luyện thi Đại học môn Toán cấp tốc 2024",
    description:
      "Khóa học tổng ôn toàn bộ kiến thức Toán 12, rèn luyện kỹ năng giải đề thi ĐH trong thời gian ngắn nhất.",
    subject: "Toán học",
    level: "Cấp 3",
    format: "online",
    instructor: {
      id: "t3",
      name: "Cô Phạm Thu Thủy",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Pham+Thu+Thuy&background=f59e0b&color=fff",
      role: "Gia sư Toán",
    },
    rating: 4.9,
    reviewCount: 891,
    studentCount: 5100,
    price: 899000,
    status: "hot",
  },
  {
    id: "4",
    title: "Lập trình Web Cơ bản (HTML/CSS/JS)",
    description:
      "Khóa học dành cho người mới bắt đầu, xây dựng nền tảng vững chắc về lập trình web từ HTML, CSS đến JavaScript.",
    subject: "Lập trình",
    level: "Cơ bản",
    format: "online",
    instructor: {
      id: "t4",
      name: "Thầy Lê Văn Nam",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Le+Van+Nam&background=3b82f6&color=fff",
      role: "Lập trình viên",
    },
    rating: 4.7,
    reviewCount: 320,
    studentCount: 2680,
    price: 500000,
    status: "suggested",
  },
  {
    id: "5",
    title: "Hóa học lớp 11 - Luyện đề chuyên sâu",
    description:
      "Phương pháp giải bài tập Hóa học hiệu quả, từ các dạng bài cơ bản đến nâng cao, đặc biệt dành cho kỳ thi THPT.",
    subject: "Hóa học",
    level: "Cấp 3",
    format: "online",
    instructor: {
      id: "t5",
      name: "Cô Nguyễn Hà Linh",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Nguyen+Ha+Linh&background=ec4899&color=fff",
      role: "Gia sư Hóa học",
    },
    rating: 4.6,
    reviewCount: 187,
    studentCount: 1230,
    price: 750000,
  },
  {
    id: "6",
    title: "Toán tư duy cho học sinh cấp 2",
    description:
      "Phát triển tư duy logic và kỹ năng giải toán cho học sinh trung học cơ sở thông qua các bài tập sáng tạo.",
    subject: "Toán học",
    level: "Cấp 2",
    format: "offline",
    instructor: {
      id: "t6",
      name: "Thầy Đinh Trọng Khôi",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Dinh+Trong+Khoi&background=8b5cf6&color=fff",
      role: "Gia sư Toán",
    },
    rating: 4.5,
    reviewCount: 98,
    studentCount: 640,
    price: 600000,
  },
  {
    id: "7",
    title: "Tiếng Anh giao tiếp thực chiến",
    description:
      "Xây dựng phản xạ tiếng Anh tự nhiên thông qua các tình huống thực tế hàng ngày, tăng tự tin khi giao tiếp.",
    subject: "Tiếng Anh",
    level: "Giao tiếp",
    format: "online",
    instructor: {
      id: "t7",
      name: "Cô Trần Thị Mai",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Tran+Thi+Mai&background=06b6d4&color=fff",
      role: "Giảng viên Tiếng Anh",
    },
    rating: 4.8,
    reviewCount: 445,
    studentCount: 3870,
    price: 800000,
    status: "hot",
  },
  {
    id: "8",
    title: "Kỹ năng thuyết trình và giao tiếp",
    description:
      "Rèn luyện kỹ năng mềm quan trọng: thuyết trình tự tin, giao tiếp hiệu quả và xây dựng mối quan hệ bền vững.",
    subject: "Kỹ năng mềm",
    level: "Tất cả cấp độ",
    format: "online",
    instructor: {
      id: "t8",
      name: "Thầy Nguyễn Minh Hiếu",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Nguyen+Minh+Hieu&background=f97316&color=fff",
      role: "Chuyên gia đào tạo",
    },
    rating: 4.7,
    reviewCount: 267,
    studentCount: 2150,
    price: 950000,
    status: "suggested",
  },
  {
    id: "9",
    title: "Ngữ văn 12 - Luyện văn nghị luận đạt điểm cao",
    description:
      "Phương pháp làm bài văn nghị luận xã hội và văn học đạt điểm cao trong kỳ thi THPT Quốc gia.",
    subject: "Ngữ văn",
    level: "Cấp 3",
    format: "offline",
    instructor: {
      id: "t9",
      name: "Cô Lê Thị Hương",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Le+Thi+Huong&background=84cc16&color=fff",
      role: "Gia sư Văn",
    },
    rating: 4.4,
    reviewCount: 143,
    studentCount: 980,
    price: 550000,
  },
  {
    id: "10",
    title: "Lập trình Python từ cơ bản đến nâng cao",
    description:
      "Học lập trình Python từ zero, áp dụng vào phân tích dữ liệu, tự động hóa và làm quen với trí tuệ nhân tạo.",
    subject: "Lập trình",
    level: "Tất cả cấp độ",
    format: "online",
    instructor: {
      id: "t10",
      name: "Thầy Phạm Đức Thành",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Pham+Duc+Thanh&background=0ea5e9&color=fff",
      role: "Kỹ sư phần mềm",
    },
    rating: 4.9,
    reviewCount: 678,
    studentCount: 4520,
    price: 1100000,
    status: "hot",
  },
  {
    id: "11",
    title: "Vật lý cơ bản lớp 10 - Nền tảng vững chắc",
    description:
      "Xây dựng nền tảng Vật lý vững chắc từ lớp 10, hiểu bản chất các hiện tượng tự nhiên qua thí nghiệm trực quan.",
    subject: "Vật lý",
    level: "Cấp 3",
    format: "online",
    instructor: {
      id: "t11",
      name: "Thầy Hoàng Đức Long",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Hoang+Duc+Long&background=7c3aed&color=fff",
      role: "Gia sư Vật lý",
    },
    rating: 4.5,
    reviewCount: 156,
    studentCount: 890,
    price: 480000,
  },
  {
    id: "12",
    title: "TOEIC 800+ - Chiến lược làm bài",
    description:
      "Chiến lược làm bài TOEIC hiệu quả, nắm vững cấu trúc đề thi, tối ưu thời gian và đạt điểm 800+ dễ dàng.",
    subject: "Tiếng Anh",
    level: "IELTS/TOEIC",
    format: "online",
    instructor: {
      id: "t12",
      name: "Cô Vũ Thị Lan",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Vu+Thi+Lan&background=059669&color=fff",
      role: "Giảng viên TOEIC",
    },
    rating: 4.6,
    reviewCount: 289,
    studentCount: 1760,
    price: 920000,
  },
];

// Suggested courses for the carousel (courses with a status badge)
// TODO: Replace with API call: GET /courses?isFeatured=true or similar endpoint
export const SUGGESTED_COURSES = MOCK_COURSES.filter((c) => c.status);
