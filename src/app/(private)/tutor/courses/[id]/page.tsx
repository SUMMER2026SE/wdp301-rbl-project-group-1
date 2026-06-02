"use client";

import {
  AssignmentsSection,
  AttendanceStatsSection,
  ClassNotesSection,
  ClassResourcesSection,
  StartSessionButton,
  TopScoresSection,
} from "@/src/features/tutor/courses-detail/components";
import { ClipboardList, Loader2, Calendar, MapPin, Video, CreditCard } from "lucide-react";
import { useGetBookingByIdQuery } from "@/src/features/booking/bookingApi";
import { useParams } from "next/navigation";
import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Card, CardContent } from "@/src/shared/components/ui/card";

// Mock data (kept for UI layout placeholder)
const attendanceData = { totalSessions: 8, attendanceRate: 92, lateCount: 5, absentCount: 3, totalStudents: 15, lastSessionAttendance: 14 };
const topStudents = [ { id: "1", name: "Nguyễn Văn A", averageScore: 9.5, rank: 1 }, { id: "2", name: "Trần Thị B", averageScore: 9.2, rank: 2 } ];
const assignments = [ { id: "1", icon: <ClipboardList className="size-5" />, iconBgColor: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", title: "Bài tập Đại số: Phương trình bậc 2", dueDate: "Hôm nay", dueTime: "23:59", submitted: 12, total: 15, actionButtonText: "Chi tiết", isCompleted: false } ];
const classResources = [ { id: "1", name: "Bài giảng PPT - Buổi 8.pdf", uploadDate: "Hôm qua", fileSize: "2.4 MB", type: "pdf" as const } ];

export default function OverviewPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { data: response, isLoading } = useGetBookingByIdQuery({ id: bookingId });
  const booking = response?.data;

  if (isLoading) {
    return (
      <div className="flex h-[30vh] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) return null;
  const isOnline = booking.mode === "ONLINE";
  const dayMap: Record<number, string> = { 0: "Chủ nhật", 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7" };

  return (
    <div className="flex flex-col gap-8">
      {/* Action / Start Session */}
      <StartSessionButton />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Booking Info Card (New) */}
          <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden bg-card">
            <CardContent className="p-6 md:p-8 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-foreground">Thông tin Đăng ký</h2>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                <Avatar
                  src={booking.student.avatarUrl || ""}
                  alt={booking.student.nickname || "Học sinh"}
                  fallback={booking.student.nickname || "HS"}
                  className="size-14 border-2 border-background"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Học sinh</span>
                  <span className="text-lg font-black">{booking.student.nickname || "Chưa cập nhật"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl border border-border/50">
                  <div className={`p-2 rounded-full ${isOnline ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    {isOnline ? <Video className="size-5" /> : <MapPin className="size-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground font-medium">Hình thức</span>
                    <span className="font-bold">{isOnline ? "Trực tuyến (Meet)" : "Học tại nhà"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-border/50">
                  <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
                    <CreditCard className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground font-medium">Học phí</span>
                    <span className="font-bold">{booking.price ? `${booking.price.toLocaleString("vi-VN")} đ` : "Thỏa thuận"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Calendar className="size-4" />
                  <span>Lịch học mong muốn</span>
                </div>
                {booking.scheduleRules && booking.scheduleRules.length > 0 ? (
                  <div className="flex flex-col gap-1 mt-2">
                    {booking.scheduleRules.map((rule, idx) => (
                      <span key={idx} className="text-sm font-medium">
                        • {dayMap[rule.dayOfWeek] || `Thứ ${rule.dayOfWeek}`}: {rule.startTime} - {rule.endTime}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Chưa có lịch cụ thể</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-foreground">Lời nhắn từ học sinh:</span>
                <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-xl italic">
                  &quot;{booking.message || "Không có lời nhắn"}&quot;
                </p>
              </div>

            </CardContent>
          </Card>

          <div className="opacity-50 pointer-events-none space-y-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tính năng đang phát triển</h3>
            <AttendanceStatsSection data={attendanceData} />
            <AssignmentsSection assignments={assignments} />
            <TopScoresSection students={topStudents} />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8 opacity-50 pointer-events-none">
          <ClassResourcesSection resources={classResources} />
          <ClassNotesSection />
        </div>
      </div>
    </div>
  );
}
