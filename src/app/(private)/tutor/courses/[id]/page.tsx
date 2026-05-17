"use client";

import {
  AssignmentsSection,
  AttendanceStatsSection,
  ClassNotesSection,
  ClassResourcesSection,
  StartSessionButton,
  TopScoresSection,
} from "@/src/features/tutor/courses-detail/components";
import { ClipboardCheck, ClipboardList } from "lucide-react";

// Mock data
const attendanceData = {
  totalSessions: 8,
  attendanceRate: 92,
  lateCount: 5,
  absentCount: 3,
  totalStudents: 15,
  lastSessionAttendance: 14,
};

const topStudents = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    averageScore: 9.5,
    rank: 1,
  },
  {
    id: "2",
    name: "Trần Thị B",
    averageScore: 9.2,
    rank: 2,
  },
  {
    id: "3",
    name: "Lê Văn C",
    averageScore: 8.9,
    rank: 3,
  },
];

const assignments = [
  {
    id: "1",
    icon: <ClipboardList className="size-5" />,
    iconBgColor:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    title: "Bài tập Đại số: Phương trình bậc 2",
    dueDate: "Hôm nay",
    dueTime: "23:59",
    submitted: 12,
    total: 15,
    actionButtonText: "Chi tiết",
    isCompleted: false,
  },
  {
    id: "2",
    icon: <ClipboardCheck className="size-5" />,
    iconBgColor: "bg-slate-100 dark:bg-slate-800 text-slate-500",
    title: "Bài tập Hình học: Vectơ",
    dueDate: "10/10/2023",
    dueTime: "23:59",
    submitted: 15,
    total: 15,
    actionButtonText: "Chấm bài",
    isCompleted: true,
  },
];

const classResources = [
  {
    id: "1",
    name: "Bài giảng PPT - Buổi 8.pdf",
    uploadDate: "Hôm qua",
    fileSize: "2.4 MB",
    type: "pdf" as const,
  },
  {
    id: "2",
    name: "Đề cương ôn tập HK1.docx",
    uploadDate: "12/10/2023",
    fileSize: "1.1 MB",
    type: "doc" as const,
  },
  {
    id: "3",
    name: "Danh sách nhóm thảo luận.xlsx",
    uploadDate: "05/10/2023",
    fileSize: "0.5 MB",
    type: "xlsx" as const,
  },
];

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Start Session Button */}
      <StartSessionButton />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Attendance Stats */}
          <AttendanceStatsSection data={attendanceData} />

          {/* Assignments Section */}
          <AssignmentsSection assignments={assignments} />

          {/* Top Scores */}
          <TopScoresSection students={topStudents} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Class Resources */}
          <ClassResourcesSection resources={classResources} />

          {/* Class Notes */}
          <ClassNotesSection />
        </div>
      </div>
    </div>
  );
}
