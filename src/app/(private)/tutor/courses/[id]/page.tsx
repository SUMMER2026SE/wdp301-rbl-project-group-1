"use client";

import { useMemo } from "react";
import { format, isPast, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { useParams } from "next/navigation";
import {
  useGetBookingByIdQuery,
  useGetMySessionsQuery,
} from "@/src/features/booking/bookingApi";
import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Button } from "@/src/shared/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  MessageSquare,
  Video,
  XCircle,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const DAY_MAP: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};

export default function TutorCourseOverviewPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const { data: response, isLoading: isBookingLoading } =
    useGetBookingByIdQuery({ id: bookingId });
  const booking = response?.data;

  const { data: sessionsResponse, isLoading: isSessionsLoading } =
    useGetMySessionsQuery({});

  const sessions = useMemo(() => {
    return (
      sessionsResponse?.data
        ?.filter((s) => s.bookingId === bookingId)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        ) || []
    );
  }, [sessionsResponse?.data, bookingId]);

  const isLoading = isBookingLoading || isSessionsLoading;

  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const upcomingSession = sessions.find(
    (s) =>
      s.status === "SCHEDULED" &&
      !isPast(new Date(s.startTime))
  );
  const todaySession = sessions.find(
    (s) => s.status === "SCHEDULED" && isToday(new Date(s.startTime))
  );

  if (isLoading) {
    return (
      <div className="flex h-[30vh] w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!booking) return null;

  const isOnline = booking.mode === "ONLINE";

  return (
    <div className="flex flex-col gap-6">
      {/* Today's session banner */}
      {todaySession && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Video className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Hôm nay có buổi học</p>
              <p className="font-bold">
                {format(new Date(todaySession.startTime), "HH:mm")} -{" "}
                {format(new Date(todaySession.endTime), "HH:mm")}
              </p>
            </div>
          </div>
          {todaySession.meetingUrl ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto gap-2 font-semibold"
              asChild
            >
              <a
                href={todaySession.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Video className="size-4" />
                Vào lớp ngay
              </a>
            </Button>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Student & Booking Info */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Student card */}
          <Card className="border-border rounded-2xl bg-card shadow-none">
            <CardContent className="p-5 flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Học sinh
              </h3>
              <div className="flex items-center gap-3">
                <Avatar
                  src={booking.student.avatarUrl || ""}
                  alt={booking.student.nickname || "Học sinh"}
                  fallback={(booking.student.nickname || "HS").slice(0, 2).toUpperCase()}
                  className="size-12 border border-border"
                />
                <div>
                  <p className="font-bold text-base">
                    {booking.student.nickname || "Chưa cập nhật"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Đăng ký {format(new Date(booking.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>

              {/* Mode & Price */}
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isOnline ? (
                      <Video className="size-4" />
                    ) : (
                      <MapPin className="size-4" />
                    )}
                    <span>Hình thức</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {isOnline ? "Trực tuyến" : "Tại nhà"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="size-4" />
                    <span>Học phí</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {booking.price
                      ? `${booking.price.toLocaleString("vi-VN")} đ`
                      : "Thỏa thuận"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="size-4" />
                    <span>Tiến độ</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {completedCount}/{sessions.length} buổi
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule rules */}
          {booking.scheduleRules && booking.scheduleRules.length > 0 && (
            <Card className="border-border rounded-2xl bg-card shadow-none">
              <CardContent className="p-5 flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Lịch học đăng ký
                </h3>
                <div className="flex flex-col gap-2">
                  {booking.scheduleRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {DAY_MAP[rule.dayOfWeek] || `Thứ ${rule.dayOfWeek}`}
                        </span>
                      </div>
                      <span className="text-muted-foreground tabular-nums">
                        {rule.startTime} – {rule.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message from student */}
          {booking.message && (
            <Card className="border-border rounded-2xl bg-card shadow-none">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <MessageSquare className="size-3.5" />
                  <span>Lời nhắn</span>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed border-l-2 border-primary/30 pl-3">
                  &ldquo;{booking.message}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — Sessions List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">
              Các buổi học
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({sessions.length} buổi)
              </span>
            </h3>
            {upcomingSession && (
              <div className="text-xs text-muted-foreground">
                Buổi tiếp:{" "}
                <span className="font-semibold text-foreground">
                  {format(new Date(upcomingSession.startTime), "dd/MM", {
                    locale: vi,
                  })}
                </span>
              </div>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-muted/20">
              <Calendar className="size-8 text-muted-foreground mb-3 opacity-40" />
              <p className="text-sm font-medium text-muted-foreground">
                Chưa có buổi học nào.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1 text-center max-w-[260px]">
                Các buổi học sẽ được tạo sau khi lớp được xác nhận và thanh toán.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sessions.map((session, index) => {
                const isCompleted = session.status === "COMPLETED";
                const isCancelled = session.status === "CANCELLED";
                const start = new Date(session.startTime);
                const end = new Date(session.endTime);
                const isSessionToday = isToday(start);

                return (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border transition-colors ${
                      isSessionToday
                        ? "border-primary/30 bg-primary/5"
                        : isCompleted
                        ? "border-border/50 bg-muted/20"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? "bg-success/15 text-success"
                            : isCancelled
                            ? "bg-destructive/15 text-destructive"
                            : isSessionToday
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="size-4" />
                        ) : isCancelled ? (
                          <XCircle className="size-4" />
                        ) : (
                          <Clock className="size-4" />
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          Buổi {index + 1}
                          {session.title ? ` – ${session.title}` : ""}
                          {isSessionToday && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                              Hôm nay
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {format(start, "EEE dd/MM", { locale: vi })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {format(start, "HH:mm")} – {format(end, "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right action */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant={
                          isCompleted
                            ? "success"
                            : isCancelled
                            ? "destructive"
                            : isSessionToday
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px] whitespace-nowrap"
                      >
                        {isCompleted
                          ? "Đã học"
                          : isCancelled
                          ? "Đã hủy"
                          : isSessionToday
                          ? "Hôm nay"
                          : "Sắp tới"}
                      </Badge>

                      {session.meetingUrl && !isCompleted && !isCancelled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1"
                          asChild
                        >
                          <a
                            href={session.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Video className="size-3" />
                            Vào lớp
                          </a>
                        </Button>
                      )}

                      <ChevronRight className="size-4 text-muted-foreground/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
