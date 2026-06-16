"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { format, isToday, isAfter, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, Variants } from "framer-motion";
import { 
  Calendar, 
  Users, 
  Wallet, 
  ArrowRight, 
  Video, 
  Clock, 
  BookOpen, 
  Sparkles,
  MapPin,
  MessageCircle,
  Briefcase
} from "lucide-react";
import { useGetMySessionsQuery } from "@/src/features/booking/bookingApi";
import { useGetMeQuery } from "@/src/features/auth/authApi";
import { useGetTutorRequestsQuery } from "@/src/features/tutor-request/tutorRequestApi";
import { useAppSelector } from "@/src/shared/store/hooks";
import { Button } from "@/src/shared/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function TutorHome() {
  const { data: meData } = useGetMeQuery();
  const user = meData?.data;
  // Fetch data
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetMySessionsQuery({});
  
  const { data: requestsData, isLoading: isLoadingRequests } = useGetTutorRequestsQuery({
    status: "OPEN",
    limit: "5",
    sortOrder: "desc",
    subjectIds: [],
    gradeIds: []
  });

  // Calculate greeting
  const currentHour = new Date().getHours();
  let greeting = "Chào buổi sáng";
  if (currentHour >= 12 && currentHour < 18) greeting = "Chào buổi chiều";
  else if (currentHour >= 18) greeting = "Chào buổi tối";

  const { todaySessions, nextSession } = useMemo(() => {
    const sessions = sessionsData?.data || [];
    const now = new Date();
    let next: typeof sessions[0] | null = null;
    let todayCount = 0;

    const sortedSessions = [...sessions].sort(
      (a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
    );

    for (const session of sortedSessions) {
      if (session.status === "CANCELLED") continue;
      
      const sessionDate = parseISO(session.startTime);
      
      if (isToday(sessionDate)) {
        todayCount++;
      }
      
      if (isAfter(sessionDate, now) && !next) {
        next = session;
      }
    }

    return { todaySessions: todayCount, nextSession: next };
  }, [sessionsData?.data]);

  // Process Requests
  const recentRequests = requestsData?.data || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full min-h-[100dvh]">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2 mb-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary w-fit text-sm font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Dashboard Giảng Viên</span>
        </div>
        <h1 className="text-foreground text-3xl md:text-5xl font-black tracking-tight">
          {greeting}, {user?.nickname || "Thầy/Cô"}!
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Hôm nay bạn có <strong className="text-foreground">{todaySessions}</strong> buổi dạy. Chúc bạn một ngày làm việc hiệu quả.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* LEFT COLUMN: MAIN ACTION & UPCOMING */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* NEXT CLASS WIDGET */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm group transition-all hover:shadow-md">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            
            <div className="p-6 md:p-8 relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Buổi dạy tiếp theo
                </h2>
                {nextSession && (
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-primary px-3 py-1 rounded-full animate-pulse">
                    Sắp diễn ra
                  </span>
                )}
              </div>

              {isLoadingSessions ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : nextSession ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/30 p-6 rounded-xl border border-border/50">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-foreground line-clamp-1">
                      {nextSession.title || nextSession.subjectName || "Buổi học không tên"}
                    </h3>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium mt-2">
                      <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md shadow-sm border border-border/50">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          {format(parseISO(nextSession.startTime), "HH:mm")} - {format(parseISO(nextSession.endTime), "HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md shadow-sm border border-border/50">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="capitalize">
                          {format(parseISO(nextSession.startTime), "EEEE, dd/MM", { locale: vi })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
                    <Button asChild className="h-12 px-6 rounded-xl font-bold shadow-sm" variant="default">
                      <Link href={`/tutor/courses/${nextSession.bookingId}`}>
                        Vào lớp học
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-xl border border-dashed border-border/60">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Không có buổi dạy sắp tới</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                    Bạn hiện chưa có lịch dạy nào trong thời gian tới. Hãy nghỉ ngơi hoặc xem qua các yêu cầu tìm gia sư nhé!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* QUICK SHORTCUTS */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/tutor/courses" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Lớp của tôi</span>
            </Link>
            
            <Link href="/tutor/schedule" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Lịch giảng dạy</span>
            </Link>
            
            <Link href="/tutor/requests" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Nhận lớp mới</span>
            </Link>

            <Link href="/tutor/profile" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Hồ sơ gia sư</span>
            </Link>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: REQUESTS & STATS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* NEW REQUESTS WIDGET */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
              <h2 className="font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Yêu cầu tìm gia sư
              </h2>
              <Link href="/tutor/requests" className="text-xs font-semibold text-primary hover:underline">
                Xem tất cả
              </Link>
            </div>
            
            <div className="p-2 flex flex-col">
              {isLoadingRequests ? (
                <div className="p-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentRequests.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {recentRequests.map(req => (
                    <Link 
                      href={`/tutor/requests`} 
                      key={req.id}
                      className="p-4 rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-2 group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {req.title}
                        </h4>
                        <span className="shrink-0 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-sm">
                          {req.budget ? `${req.budget.toLocaleString()}đ/b` : "Thoả thuận"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> {req.subject?.name || "Môn học khác"}
                        </span>
                        <span className="flex items-center gap-1">
                          {req.mode === "ONLINE" ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                          {req.mode === "ONLINE" ? "Online" : "Tận nơi"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <MessageCircle className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">Chưa có yêu cầu mới nào</p>
                </div>
              )}
            </div>
            
            {recentRequests.length > 0 && (
              <div className="p-3 border-t border-border bg-muted/10">
                <Button asChild variant="ghost" className="w-full text-xs h-9">
                  <Link href="/tutor/requests">
                    Khám phá thêm yêu cầu
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>

          {/* QUICK STATS */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-bold tracking-tight">Tổng quan hôm nay</h2>
            
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Số ca dạy</p>
                  <p className="text-xl font-bold leading-none mt-1">{todaySessions}</p>
                </div>
              </div>
              <div className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">
                Hôm nay
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Yêu cầu mở</p>
                  <p className="text-xl font-bold leading-none mt-1">{requestsData?.meta.total || 0}</p>
                </div>
              </div>
              <div className="text-orange-600 text-xs font-bold bg-orange-500/10 px-2 py-1 rounded">
                Hệ thống
              </div>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}