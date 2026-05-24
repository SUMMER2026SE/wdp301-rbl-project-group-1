import {
  CircleDollarSign,
  UserCheck,
  Users,
} from "lucide-react";
import type {
  ApprovalItem,
  RevenueBar,
  StatItem,
  WithdrawalRequest,
} from "./admin-dashboard.types";

export const stats: StatItem[] = [
  {
    label: "Tổng người dùng",
    value: "1,250",
    change: "+15%",
    icon: Users,
    tone: "bg-info-soft text-info",
  },
  {
    label: "Doanh thu",
    value: "125M",
    suffix: "₫",
    change: "+5%",
    icon: CircleDollarSign,
    tone: "bg-success-soft text-success",
  },
  {
    label: "Tỷ lệ hoàn thành",
    value: "95",
    suffix: "%",
    change: "+2%",
    icon: UserCheck,
    tone: "bg-purple-soft text-purple",
  },
];

export const approvalQueue: ApprovalItem[] = [
  {
    name: "Nguyễn Thị A",
    subject: "Toán học",
    time: "Đã gửi 2h trước",
    initials: "NA",
  },
  {
    name: "Trần Văn B",
    subject: "Vật lý",
    time: "Đã gửi 5h trước",
    initials: "TB",
  },
  {
    name: "Lê Thị C",
    subject: "Tiếng Anh",
    time: "Đã gửi 1 ngày trước",
    initials: "LC",
  },
];

export const withdrawals: WithdrawalRequest[] = [
  {
    tutor: "Phạm Minh D",
    amount: "2,500,000 ₫",
    date: "24/10/2023",
    status: "Đang chờ",
  },
  {
    tutor: "Ngô Hữu E",
    amount: "1,200,000 ₫",
    date: "23/10/2023",
    status: "Đang chờ",
  },
];

export const revenueBars: RevenueBar[] = [
  { label: "W1", height: "h-[54%]" },
  { label: "W2", height: "h-[68%]" },
  { label: "W3", height: "h-[48%]" },
  { label: "W4", height: "h-[82%]" },
  { label: "W5", height: "h-[76%]" },
  { label: "W6", height: "h-[92%]" },
  { label: "W7", height: "h-[70%]" },
  { label: "W8", height: "h-[88%]" },
];
