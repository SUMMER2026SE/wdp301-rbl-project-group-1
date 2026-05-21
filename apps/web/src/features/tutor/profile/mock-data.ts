interface UpgradePlan {
  id: string;
  name: string;
  price: number;
  period: string;
  cta: string;
  badge?: string;
  badgeColor?: "yellow" | "blue" | "green";
  features: {
    text: string;
    included: boolean;
    warning?: boolean;
  }[];
  isPrimary?: boolean;
}

export const upgradePlans: UpgradePlan[] = [
  {
    id: "standard",
    name: "Thường",
    price: 60000,
    period: "buổi",
    cta: "Không khả dụng",
    badge: "Đồng",
    badgeColor: "blue",
    features: [
      { text: "Hiển thị cơ bản trên tìm kiếm", included: true },
      { text: "Phí dịch vụ kết nối 20%", included: true },
      { text: "Không có hỗ trợ học liệu", included: false },
      { text: "Không ưu tiên hiển thị", included: false },
    ],
  },
  {
    id: "premium",
    name: "Standard",
    price: 75000,
    period: "buổi",
    cta: "Đang sử dụng",
    badge: "Bạc",
    badgeColor: "blue",
    isPrimary: true,
    features: [
      { text: "Có ít nhất 1 chứng chỉ xác thực", included: true },
      { text: "Kinh nghiệm dạy > 1 năm", included: true },
    ],
  },
  {
    id: "elite",
    name: "Premium",
    price: 90000,
    period: "buổi",
    cta: "Nâng cấp ngay",
    badge: "Vàng",
    badgeColor: "yellow",
    features: [
      { text: "Bằng cử nhân trở lên", included: true },
      {
        text: "Chứng chỉ quốc tế (IELTS 7.5+)",
        included: false,
        warning: true,
      },
      { text: "Kinh nghiệm dạy > 3 năm", included: false, warning: true },
    ],
  },
];

export const tutorInfo = {
  id: "1",
  name: "Nguyễn Văn A",
  subject: "Giáo dục - Tiếng Anh",
  rating: 4.8,
  reviewCount: 150,
  location: "Hà Nội",
  workType: "Full-time",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFw1u8sokUlZuCj_LHaYtmATQsk2gCQEKCkbyuIH0RTL8C9BPRZfhjl-T2SN57DBiaTz82K58YnVuIvHuiI1R4KhiwgEWlwmlc2CTqqEcZqtytPa9vviRau3Zcb_-g3XBFLXwrRt3oAcvUjv4POHqQzGKkC6tKi6pIj4khz2JSIaMyN4FNusThStEjvNLR3UO7BoM-m50ywaB5JYU8IqXfMbUSExCtrqf0U_LFnkQhv8DcwtPVRCdlG6EFPAJdjh8CYVB3Rh-RRSg",
};
