"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useParams } from "next/navigation";

import {
  useCreateBookingReviewMutation,
  useGetBookingByIdQuery,
  useGetMySessionsQuery,
} from "@/src/features/booking/bookingApi";
import {
  CourseHeader,
  OnlineClassInfo,
  ProgressCircle,
  ConfirmAttendanceDialog,
} from "@/src/features/student/courses-detail/components";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { 
  RenewBookingModal, 
  RescheduleSessionModal, 
  ApproveRescheduleButton, 
  RejectRescheduleButton 
} from "@/src/features/booking/components";

import { Loader2, Calendar, Clock, Video, CheckCircle2, Play, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Button } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { toast } from "sonner";

export default function CourseDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const {
    data: response,
    isLoading: isBookingLoading,
    isError,
  } = useGetBookingByIdQuery({ id: bookingId });
  const booking = response?.data;

  const [createReview, { isLoading: isSubmittingReview }] = useCreateBookingReviewMutation();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const handleSubmitReview = async () => {
    if (!booking) return;

    try {
      await createReview({
        bookingId: booking.id,
        createReviewDto: {
          rating,
          comment: comment.trim() || undefined,
        },
      }).unwrap();
      setIsReviewSubmitted(true);
      toast.success("Gửi đánh giá thành công");
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Không thể gửi đánh giá. Vui lòng thử lại.";
      toast.error(message);
    }
  };

  const { data: sessionsResponse, isLoading: isSessionsLoading } = useGetMySessionsQuery({});

  const bookingGroupId = booking?.groupId;

  const sessions = useMemo(() => {
    return (
      sessionsResponse?.data
        ?.filter((s) => {
          if (bookingGroupId && s.groupId) {
            return s.groupId === bookingGroupId;
          }
          return s.bookingId === bookingId;
        })
        .sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ) || []
    );
  }, [sessionsResponse?.data, bookingId, bookingGroupId]);

  const meetingUrl = useMemo(() => {
    return sessions.find(s => s.meetingUrl)?.meetingUrl || "";
  }, [sessions]);

  const completedLessonsCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const showRenewButton = completedLessonsCount > 0 || booking?.status === "COMPLETED";

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
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">
                    Yêu cầu đã được xác nhận!
                  </h3>
                  <p className="text-purple-700 dark:text-purple-400">
                    Gia sư đã chấp nhận yêu cầu của bạn. Vui lòng thanh toán để
                    chính thức bắt đầu khóa học.
                  </p>
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

          {/* Awaiting Confirmation Alert */}
          {sessions.some((s) => s.status === "AWAITING_CONFIRMATION") && (
            <Card className="border-amber-200 shadow-sm rounded-[2rem] overflow-hidden bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800/50">
              <CardContent className="p-6 md:p-8 flex items-start gap-4">
                <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 mt-1">
                  <Sparkles className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300">Buổi học cần xác nhận!</h3>
                  <p className="text-amber-700 dark:text-amber-400">Gia sư đã đánh dấu hoàn thành một số buổi học. Vui lòng kiểm tra lộ trình học bên dưới và xác nhận để gia sư nhận được thanh toán.</p>
                </div>
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
                  const isAwaitingConfirmation = session.status === "AWAITING_CONFIRMATION";
                  const isRescheduleRequested = session.status === "RESCHEDULE_REQUESTED";
                  
                  const startTime = new Date(session.startTime);
                  const endTime = new Date(session.endTime);

                  return (
                    <Card key={session.id} className={`border-border shadow-sm rounded-2xl overflow-hidden transition-colors ${isCompleted ? 'bg-success-soft/10 dark:bg-success-soft/5' : isAwaitingConfirmation ? 'bg-amber-50 dark:bg-amber-900/10' : isRescheduleRequested ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-card'}`}>
                      <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-start gap-4 w-full">
                          <div className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                            isCompleted ? 'bg-success/20 text-success' : 
                            isCancelled ? 'bg-destructive/20 text-destructive' : 
                            isAwaitingConfirmation ? 'bg-amber-500/20 text-amber-600 dark:text-amber-500' :
                            isRescheduleRequested ? 'bg-blue-500/20 text-blue-600 dark:text-blue-500' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="size-5" /> : <Play className="size-5 ml-0.5" />}
                          </div>

                          <div className="flex flex-col flex-1">
                            <h4 className={`font-semibold text-base ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              Buổi {index + 1}{session.title ? `: ${session.title}` : ""}
                            </h4>

                            <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm ${isRescheduleRequested ? 'text-muted-foreground line-through opacity-70' : 'text-muted-foreground'}`}>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" />
                                <span>{format(startTime, "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                <span>{format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}</span>
                              </div>
                            </div>

                            {isRescheduleRequested && session.proposedStartTime && session.proposedEndTime && (
                              <div className="flex flex-col gap-1 mt-3 p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                  Thời gian đề xuất dời lịch:
                                </p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-700 dark:text-blue-400">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5" />
                                    <span>{format(new Date(session.proposedStartTime), "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="size-3.5" />
                                    <span>{format(new Date(session.proposedStartTime), "HH:mm")} - {format(new Date(session.proposedEndTime), "HH:mm")}</span>
                                  </div>
                                </div>
                                {session.proposedReason && (
                                  <p className="text-sm text-blue-700/80 dark:text-blue-400/80 mt-1 italic">
                                    Lý do: {session.proposedReason}
                                  </p>
                                )}
                              </div>
                            )}

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
                            isAwaitingConfirmation ? "secondary" :
                            isRescheduleRequested ? "outline" :
                            "default"
                          } className={isAwaitingConfirmation ? "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 w-fit" : isRescheduleRequested ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-300 w-fit" : "w-fit"}>
                            {isCompleted ? "Đã học" : isCancelled ? "Đã hủy" : isAwaitingConfirmation ? "Chờ xác nhận" : isRescheduleRequested ? "Yêu cầu dời lịch" : "Sắp tới"}
                          </Badge>

                          {isAwaitingConfirmation && (
                            <ConfirmAttendanceDialog 
                              sessionId={session.id} 
                              sessionIndex={index + 1}
                              sessionTitle={session.title || undefined}
                              tutorName={booking.tutor.name}
                            />
                          )}

                          {!isCompleted && !isCancelled && !isAwaitingConfirmation && !isRescheduleRequested && (
                            <RescheduleSessionModal
                              sessionId={session.id}
                              currentStartTime={session.startTime}
                              currentEndTime={session.endTime}
                              trigger={
                                <Button variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
                                  Dời lịch
                                </Button>
                              }
                            />
                          )}

                          {isRescheduleRequested && session.rescheduleRequestedBy !== null && (
                            session.rescheduleRequestedBy !== booking.studentId ? (
                              // Tutor sent the request → student can approve/reject
                              <div className="flex items-center gap-2 mt-2">
                                <RejectRescheduleButton sessionId={session.id} />
                                <ApproveRescheduleButton sessionId={session.id} />
                              </div>
                            ) : (
                              // Student sent the request → waiting for tutor response
                              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2">
                                Chờ gia sư xác nhận
                              </span>
                            )
                          )}

                          {session.meetingUrl && !isCompleted && !isCancelled && !isAwaitingConfirmation && (
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
          {showRenewButton && (
            <RenewBookingModal
              trigger={
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-500/20 py-6 text-base gap-2 font-bold group">
                  <Sparkles className="size-5 text-indigo-200 group-hover:text-white transition-colors" />
                  Gia hạn khoá học
                </Button>
              }
              bookingId={booking.id}
              tutorName={booking.tutor.name}
              pricePerHour={booking.price || 0}
            />
          )}

          <ProgressCircle
            progress={
              sessions.length > 0
                ? (completedLessonsCount / sessions.length) * 100
                : 0
            }
            completedLessons={completedLessonsCount}
            totalLessons={sessions.length}
          />

          <OnlineClassInfo
            mode={booking.mode}
            scheduleRules={booking.scheduleRules || []}
            meetLink={meetingUrl}
          />

          {booking.status === "COMPLETED" && (
            <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden bg-card">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h3 className="text-xl font-bold">Đánh giá gia sư</h3>

                {isReviewSubmitted ? (
                  <p className="text-emerald-600">
                    Bạn đã gửi đánh giá cho lớp học này.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          type="button"
                          variant={rating === star ? "default" : "outline"}
                          onClick={() => setRating(star)}
                        >
                          {star} sao
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Chia sẻ trải nghiệm học của bạn (không bắt buộc)"
                      rows={4}
                    />

                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
