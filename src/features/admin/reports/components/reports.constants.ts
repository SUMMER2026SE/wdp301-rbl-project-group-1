import {
  CheckCircle,
  Timer,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import type { ReportItem, ReportSeverity, ReportStat } from "./reports.types";

export const reportStats: ReportStat[] = [
  {
    label: "Chưa xử lý",
    value: "12",
    change: "+3",
    changeTone: "text-destructive",
    icon: TriangleAlert,
    iconTone: "bg-warning-soft text-warning",
    trendIcon: TrendingUp,
  },
  {
    label: "Thời gian giải quyết (TB)",
    value: "2.5h",
    change: "-0.5h",
    changeTone: "text-success",
    icon: Timer,
    iconTone: "bg-info-soft text-info",
    trendIcon: TrendingDown,
  },
  {
    label: "Đã giải quyết (Tháng này)",
    value: "48",
    change: "+12%",
    changeTone: "text-success",
    icon: CheckCircle,
    iconTone: "bg-success-soft text-success",
    trendIcon: TrendingUp,
  },
];

export const reports: ReportItem[] = [
  {
    id: "#KN-1024",
    reason: "Buổi học không diễn ra",
    reporter: "Lê Văn Học",
    reporterRole: "Học sinh",
    target: "Nguyễn Gia Sư",
    severity: "critical",
    severityLabel: "Nghiêm trọng",
    time: "30 phút trước",
    active: true,
  },
  {
    id: "#KN-1023",
    reason: "Thái độ không phù hợp",
    reporter: "Trần Thị Bé",
    reporterRole: "Học sinh",
    target: "Phạm Văn Dạy",
    severity: "medium",
    severityLabel: "Trung bình",
    time: "2 giờ trước",
  },
  {
    id: "#KN-1022",
    reason: "Học sinh hủy buổi sát giờ",
    reporter: "Lý Giáo Viên",
    reporterRole: "Gia sư",
    target: "Võ Vắng Mặt",
    severity: "low",
    severityLabel: "Thấp",
    time: "Hôm qua",
  },
  {
    id: "#KN-1021",
    reason: "Lỗi kết nối nền tảng",
    reporter: "Đinh Lỗi",
    reporterRole: "Học sinh",
    target: "Hệ thống",
    severity: "closed",
    severityLabel: "Đã đóng",
    time: "2 ngày trước",
    closed: true,
  },
];

export const severityClassName: Record<ReportSeverity, string> = {
  critical:
    "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  closed: "bg-secondary text-secondary-foreground hover:bg-secondary",
};
