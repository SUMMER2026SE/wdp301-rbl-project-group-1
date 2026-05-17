"use client";

import {
  AssignmentsSection,
  DocumentsSection,
  ScoreStatsSection,
} from "@/src/features/tutor/courses-detail/components";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { useParams } from "next/navigation";

export default function ResourcePage() {
  const params = useParams();
  const courseId = params.id as string;

  const documents = [
    {
      id: "1",
      icon: "picture_as_pdf" as const,
      iconColor: "red" as const,
      fileName: "Chuyên đề Hàm số - Buổi 1.pdf",
      fileSize: "2.4 MB",
      uploadTime: "2 ngày trước",
    },
    {
      id: "2",
      icon: "picture_as_pdf" as const,
      iconColor: "red" as const,
      fileName: "Bài tập về nhà - Tuần 3.pdf",
      fileSize: "1.1 MB",
      uploadTime: "5 ngày trước",
    },
    {
      id: "3",
      icon: "play_circle" as const,
      iconColor: "blue" as const,
      fileName: "Record Buổi học ngày 15/10.mp4",
      fileSize: "145 MB",
      uploadTime: "1 tuần trước",
    },
    {
      id: "4",
      icon: "folder" as const,
      iconColor: "yellow" as const,
      fileName: "Đề thi thử THPT Quốc Gia",
      fileSize: "5 files",
      uploadTime: "2 tuần trước",
    },
  ];

  const assignments = [
    {
      id: "1",
      icon: <ClipboardList className="size-5" />,
      iconBgColor:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      title: "Bài tập Hàm số bậc nhất - bậc hai",
      dueDate: "20/10/2023",
      dueTime: "23:59",
      submitted: 4,
      total: 5,
      actionButtonText: "Chấm bài",
      isCompleted: false,
    },
    {
      id: "2",
      icon: <ClipboardCheck className="size-5" />,
      iconBgColor: "bg-slate-100 dark:bg-slate-800 text-slate-500",
      title: "Bài kiểm tra 15 phút - Chương 1",
      dueDate: "10/10/2023",
      dueTime: "23:59",
      submitted: 5,
      total: 5,
      actionButtonText: "Xem kết quả",
      isCompleted: true,
    },
  ];

  const scoreData = [
    { label: "Bài 1", score: 6.0, maxScore: 10 },
    { label: "Bài 2", score: 7.5, maxScore: 10 },
    { label: "KT 15p", score: 8.5, maxScore: 10 },
    { label: "Bài 3", score: 8.0, maxScore: 10 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column - Documents and Assignments */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        {/* Documents section */}
        <DocumentsSection documents={documents} />

        {/* Assignments section */}
        <AssignmentsSection assignments={assignments} />
      </div>

      {/* Right column - Stats */}
      <div className="flex flex-col gap-6">
        <ScoreStatsSection
          dataPoints={scoreData}
          averageScore={7.5}
          maxScore={10}
        />
      </div>
    </div>
  );
}
