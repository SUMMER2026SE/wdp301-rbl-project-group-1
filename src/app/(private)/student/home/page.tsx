"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { format, isToday, isAfter, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, Variants } from "framer-motion";
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  Video, 
  Clock, 
  BookOpen, 
  Sparkles,
  MapPin,
  GraduationCap,
  Search
} from "lucide-react";
import { useGetMySessionsQuery, useGetBookingsQuery } from "@/src/features/booking/bookingApi";
import { useGetMeQuery } from "@/src/features/auth/authApi";
import { useGetRecommendedTutorsQuery } from "@/src/features/recommendation/recommendationApi";
import { Button } from "@/src/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/ui/avatar";

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

export default function StudentHome() {
  const { data: meData } = useGetMeQuery();
  const user = meData?.data;
  // Fetch data
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetMySessionsQuery({});
  
  const { data: bookingsData, isLoading: isLoadingBookings } = useGetBookingsQuery({
    status: "CONFIRMED",
    limit: 4
  });

  const { data: recommendData, isLoading: isLoadingRecommend } = useGetRecommendedTutorsQuery();

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

  // Process Recommended Tutors
  const recommendedTutors = useMemo(() => {
    const list = recommendData?.data || [];
    return list.slice(0, 3);
  }, [recommendData]);

  const activeCourses = bookingsData?.data || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full min-h-[100dvh]">
      
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-2 mb-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-info/10 text-info w-fit text-sm font-semibold mb-2">
          <GraduationCap className="w-4 h-4" />
          <span>Dashboard Học Viên</span>
        </div>
        <h1 className="text-foreground text-3xl md:text-5xl font-black tracking-tight">
          {greeting}, {user?.nickname || "Bạn"}!
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Hôm nay bạn có <strong className="text-foreground">{todaySessions}</strong> buổi học. Hãy chuẩn bị thật tốt nhé!
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
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-info/5 rounded-full blur-3xl group-hover:bg-info/10 transition-colors duration-500" />
            
            <div className="p-6 md:p-8 relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-info" />
                  Buổi học tiếp theo
                </h2>
                {nextSession && (
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-info px-3 py-1 rounded-full animate-pulse">
                    Sắp diễn ra
                  </span>
                )}
              </div>

              {isLoadingSessions ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-info border-t-transparent rounded-full animate-spin" />
                </div>
              ) : nextSession ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/30 p-6 rounded-xl border border-border/50">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-foreground line-clamp-1">
                      {nextSession.title || nextSession.subjectName || "Buổi học không tên"}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      Gia sư: <span className="text-foreground">{nextSession.counterpartName || "Chưa cập nhật"}</span>
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium mt-2">
                      <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md shadow-sm border border-border/50">
                        <Clock className="w-4 h-4 text-info" />
                        <span>
                          {format(parseISO(nextSession.startTime), "HH:mm")} - {format(parseISO(nextSession.endTime), "HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md shadow-sm border border-border/50">
                        <Calendar className="w-4 h-4 text-info" />
                        <span className="capitalize">
                          {format(parseISO(nextSession.startTime), "EEEE, dd/MM", { locale: vi })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
                    <Button asChild className="h-12 px-6 rounded-xl font-bold shadow-sm bg-info hover:bg-info/90 text-info-foreground" variant="default">
                      <Link href={`/student/my-courses/${nextSession.bookingId}`}>
                        Vào lớp học
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-xl border border-dashed border-border/60">
                  <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-info" />
                  </div>
                  <h3 className="text-lg font-bold">Không có buổi học sắp tới</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                    Bạn hiện chưa có lịch học nào trong thời gian tới. Hãy tìm kiếm gia sư để bắt đầu học tập nhé!
                  </p>
                  <Button asChild className="mt-4 bg-info hover:bg-info/90 text-info-foreground rounded-xl">
                    <Link href="/student/tutors">
                      Tìm gia sư ngay
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ACTIVE COURSES WIDGET */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Khóa học đang tham gia</h2>
              <Link href="/student/my-courses" className="text-sm font-semibold text-info hover:underline">
                Xem tất cả
              </Link>
            </div>

            {isLoadingBookings ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-card rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : activeCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCourses.slice(0, 4).map((course) => (
                  <Link 
                    key={course.id}
                    href={`/student/my-courses/${course.id}`}
                    className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-info/50 transition-all flex flex-col gap-4"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-info" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate group-hover:text-info transition-colors">
                          {course.subject?.name ? `Học kèm ${course.subject.name}` : "Lớp học gia sư"}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          Gia sư: {course.tutor.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        {course.mode === "ONLINE" ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                        {course.mode === "ONLINE" ? "Trực tuyến" : "Tận nơi"}
                      </div>
                      <div className="flex items-center text-xs font-bold text-info">
                        Vào lớp <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
               <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-2xl flex flex-col items-center gap-2 shadow-sm">
                 <BookOpen className="w-8 h-8 opacity-20" />
                 <p className="text-sm font-medium">Bạn chưa đăng ký khóa học nào</p>
               </div>
            )}
          </motion.div>

          {/* QUICK SHORTCUTS */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <Link href="/student/tutors" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-info/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Tìm gia sư</span>
            </Link>
            
            <Link href="/student/requests/new" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-info/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Tạo yêu cầu</span>
            </Link>
            
            <Link href="/student/schedule" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-info/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Lịch học</span>
            </Link>

            <Link href="/student/profile" className="group flex flex-col items-center justify-center gap-3 p-6 bg-card border border-border rounded-2xl hover:border-info/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Hồ sơ cá nhân</span>
            </Link>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: RECOMMENDATIONS & STATS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* RECOMMENDED TUTORS WIDGET */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
              <h2 className="font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Gia sư đề xuất cho bạn
              </h2>
            </div>
            
            <div className="p-2 flex flex-col">
              {isLoadingRecommend ? (
                <div className="p-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-info border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recommendedTutors.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {recommendedTutors.map(tutor => (
                    <Link 
                      href={`/student/tutors/${tutor.id}`} 
                      key={tutor.id}
                      className="p-4 rounded-xl hover:bg-muted/50 transition-colors flex gap-4 group"
                    >
                      <Avatar className="w-12 h-12 rounded-xl">
                        <AvatarImage src={tutor.avatarUrl || ""} alt={tutor.name} className="object-cover" />
                        <AvatarFallback className="rounded-xl font-bold text-lg bg-info/10 text-info">
                          {tutor.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <h4 className="font-bold text-sm line-clamp-1 group-hover:text-info transition-colors">
                          {tutor.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="shrink-0 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1 border border-amber-200/50">
                            ★ {tutor.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {tutor.subjects?.map(s => s.name).join(", ") || "Nhiều môn"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <Users className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">Chưa có đề xuất nào</p>
                  <p className="text-xs">Hãy tìm kiếm gia sư để hệ thống có thể gợi ý tốt hơn</p>
                </div>
              )}
            </div>
            
            {recommendedTutors.length > 0 && (
              <div className="p-3 border-t border-border bg-muted/10">
                <Button asChild variant="ghost" className="w-full text-xs h-9 text-info hover:text-info">
                  <Link href="/student/tutors">
                    Xem thêm gia sư
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>

          {/* QUICK STATS */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col gap-4 mt-auto">
            <h2 className="font-bold tracking-tight">Thống kê học tập</h2>
            
            <div className="flex items-center justify-between p-4 bg-info/5 rounded-xl border border-info/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-info/10 text-info rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Khóa học</p>
                  <p className="text-xl font-bold leading-none mt-1">{bookingsData?.meta.total || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-500/10 text-green-600 rounded-lg">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ca học chờ xếp</p>
                  <p className="text-xl font-bold leading-none mt-1">{sessionsData?.meta.total || 0}</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
