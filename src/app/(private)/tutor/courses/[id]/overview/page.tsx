"use client";

import {
  AttendanceStatsSection,
  ClassNotesSection,
  ClassResourcesSection,
  PendingAttendanceSection,
  StartSessionButton,
  TopScoresSection,
} from "@/src/features/tutor/courses-detail/components";
import { Loader2 } from "lucide-react";
import { useGetMySessionsQuery } from "@/src/features/booking/bookingApi";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { isPast } from "date-fns";

// Mock data for top students and resources (still static)
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
  const params = useParams();
  const bookingId = params.id as string;

  const { data: sessionsResponse, isLoading } = useGetMySessionsQuery({});

  const courseSessions = useMemo(() => {
    if (!sessionsResponse?.data) return [];
    return sessionsResponse.data.filter((s) => s.bookingId === bookingId);
  }, [sessionsResponse, bookingId]);

  const { pendingSessions, stats } = useMemo(() => {
    const pending: typeof courseSessions = [];
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    let totalEligible = 0;
    let lastSessionPresent = 0; // We will track if the last eligible session was attended

    courseSessions.forEach((session) => {
      // Eligible means the session is past or marked completed
      const isEligible =
        session.status === "COMPLETED" || isPast(new Date(session.endTime));

      if (isEligible) {
        totalEligible++;
        if (!session.attendance) {
          pending.push(session);
        } else {
          switch (session.attendance.status) {
            case "PRESENT":
              presentCount++;
              lastSessionPresent = 1;
              break;
            case "LATE":
              lateCount++;
              lastSessionPresent = 1;
              break;
            case "ABSENT":
              absentCount++;
              lastSessionPresent = 0;
              break;
            case "EXCUSED":
              lastSessionPresent = 0;
              break;
          }
        }
      }
    });

    const attendedCount = presentCount + lateCount;
    const rate = totalEligible > 0 ? Math.round((attendedCount / totalEligible) * 100) : 0;

    return {
      pendingSessions: pending.map(s => ({
        id: s.id,
        title: s.title || "Buổi học",
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      stats: {
        totalSessions: totalEligible, // Based on eligible sessions that could have been attended
        attendanceRate: rate,
        lateCount,
        absentCount,
        totalStudents: 1, // Assume 1-on-1 for now
        lastSessionAttendance: lastSessionPresent,
      },
    };
  }, [courseSessions]);

  const meetingUrl = useMemo(() => {
    return courseSessions.find(s => s.meetingUrl)?.meetingUrl || "";
  }, [courseSessions]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Start Session Button */}
      <StartSessionButton meetLink={meetingUrl} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Pending Attendance (Actionable Workflow) */}
          <PendingAttendanceSection courseId={bookingId} sessions={pendingSessions} />

          {/* Attendance Stats */}
          <AttendanceStatsSection data={stats} />

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
