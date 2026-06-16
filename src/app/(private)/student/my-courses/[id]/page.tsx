"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  CourseHeader,
  OnlineClassInfo,
  ProgressCircle,
} from "@/src/features/student/courses-detail/components";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { useGetBookingByIdQuery, useGetMySessionsQuery } from "@/src/features/booking/bookingApi";
import { useParams } from "next/navigation";
import { Loader2, Calendar, Clock, Video, CheckCircle2, Play } from "lucide-react";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Button } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";

export default function CourseDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const { data: response, isLoading: isBookingLoading, isError } = useGetBookingByIdQuery({ id: bookingId });
  const booking = response?.data;

  const { data: sessionsResponse, isLoading: isSessionsLoading } = useGetMySessionsQuery({});
  
  const sessions = useMemo(() => {
    return sessionsResponse?.data?.filter((s) => s.bookingId === bookingId).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) || [];
  }, [sessionsResponse?.data, bookingId]);

  const isLoading = isBookingLoading || isSessionsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Đang tải thông tin...</span>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-destructive font-medium">Không thể tải thông tin lớp học. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10">
      <BreadcrumbNav
        items={[
          { label: "Lớp học của tôi", href: "/student/my-courses" },
          { label: booking.subject?.name || "Chi tiết lớp học" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Main Content */}
        <div className="w-full lg:w-[70%] space-y-8">
          {booking.status === "AWAITING_PAYMENT" && (
            <Card className="border-purple-200 shadow-sm rounded-[2rem] overflow-hidden bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800/50">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">Yêu cầu đã được xác nhận!</h3>
                  <p className="text-purple-700 dark:text-purple-400">Gia sư đã chấp nhận yêu cầu của bạn. Vui lòng thanh toán để chính thức bắt đầu khóa học.</p>
                </div>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-8 h-12 text-base font-semibold whitespace-nowrap shadow-sm"
                  onClick={() => {
                    const amount = booking.price || 0;
                    const courseTitle = encodeURIComponent(`Học với gia sư ${booking.tutor.name}`);
                    const courseSubject = encodeURIComponent(booking.subject?.name || "Lớp học");
                    window.location.href = `/payment/checkout?bookingId=${booking.id}&amount=${amount}&courseTitle=${courseTitle}&courseSubject=${courseSubject}`;
                  }}
                >
                  Thanh toán ngay
                </Button>
              </CardContent>
            </Card>
          )}

          <CourseHeader booking={booking} />

          {/* Booking Message / Overview */}
          {booking.message && (
            <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden bg-card">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4">Lời nhắn tới Gia sư</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {booking.message}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Sessions List */}
          <div>
            <h3 className="text-xl font-bold mb-6">Lộ trình học ({sessions.length} buổi)</h3>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-[2rem] bg-muted/20">
                <Calendar className="size-10 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium text-center">Chưa có buổi học nào được tạo.</p>
                <p className="text-sm text-muted-foreground/70 text-center mt-1">Gia sư sẽ tạo các buổi học khi yêu cầu được xác nhận.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, index) => {
                  const isCompleted = session.status === "COMPLETED";
                  const isCancelled = session.status === "CANCELLED";
                  const startTime = new Date(session.startTime);
                  const endTime = new Date(session.endTime);
                  
                  return (
                    <Card key={session.id} className={`border-border shadow-sm rounded-2xl overflow-hidden transition-colors ${isCompleted ? 'bg-success-soft/10 dark:bg-success-soft/5' : 'bg-card'}`}>
                      <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                            isCompleted ? 'bg-success/20 text-success' : 
                            isCancelled ? 'bg-destructive/20 text-destructive' : 
                            'bg-primary/10 text-primary'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="size-5" /> : <Play className="size-5 ml-0.5" />}
                          </div>
                          
                          <div className="flex flex-col">
                            <h4 className={`font-semibold text-base ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              Buổi {index + 1}{session.title ? `: ${session.title}` : ""}
                            </h4>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                <span>{format(startTime, "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                <span>{format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}</span>
                              </div>
                            </div>
                            
                            {session.notes && (
                              <p className="text-sm text-muted-foreground mt-2 italic border-l-2 border-border pl-3">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                          <Badge variant={
                            isCompleted ? "success" : 
                            isCancelled ? "destructive" : 
                            "default"
                          } className="w-fit">
                            {isCompleted ? "Đã học" : isCancelled ? "Đã hủy" : "Sắp tới"}
                          </Badge>
                          
                          {session.meetingUrl && !isCompleted && !isCancelled && (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2" asChild>
                              <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                                <Video className="size-4" />
                                Vào lớp
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%] flex flex-col gap-6">
          <ProgressCircle
            progress={sessions.length > 0 ? (sessions.filter(s => s.status === "COMPLETED").length / sessions.length) * 100 : 0}
            completedLessons={sessions.filter(s => s.status === "COMPLETED").length}
            totalLessons={sessions.length}
          />

          <OnlineClassInfo
            mode={booking.mode}
            scheduleRules={booking.scheduleRules || []}
            meetLink={""} // meetLink is currently not in DTO
          />
        </div>
      </div>
    </div>
  );
}
