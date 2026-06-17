"use client";

import { useMemo } from "react";

import {
  useCreateBookingReviewMutation,
  useGetBookingByIdQuery,
  useGetMySessionsQuery,
} from "@/src/features/booking/bookingApi";
import {
  CourseContent,
  CourseHeader,
  OnlineClassInfo,
  ProgressCircle,
} from "@/src/features/student/courses-detail/components";
import { mockCourseDetail } from "@/src/features/student/mock-data";
import { BreadcrumbNav } from "@/src/shared/components/molecules/breadcrumb-nav/breadcrumb-nav";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
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
  const [createReview, { isLoading: isSubmittingReview }] =
    useCreateBookingReviewMutation();
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

  const { data: sessionsResponse, isLoading: isSessionsLoading } =
    useGetMySessionsQuery({});

  const sessions = useMemo(() => {
    return (
      sessionsResponse?.data
        ?.filter((s) => s.bookingId === bookingId)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ) || []
    );
  }, [sessionsResponse?.data, bookingId]);

  const isLoading = isBookingLoading || isSessionsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Đang tải thông tin...
        </span>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-destructive font-medium">
          Không thể tải thông tin lớp học. Vui lòng thử lại sau.
        </p>
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
                    const courseTitle = encodeURIComponent(
                      `Học với gia sư ${booking.tutor.name}`,
                    );
                    const courseSubject = encodeURIComponent(
                      booking.subject?.name || "Lớp học",
                    );
                    window.location.href = `/payment/checkout?bookingId=${booking.id}&amount=${amount}&courseTitle=${courseTitle}&courseSubject=${courseSubject}`;
                  }}
                >
                  Thanh toán ngay
                </Button>
              </CardContent>
            </Card>
          )}

          <CourseHeader booking={booking} />

          {/* Booking Message / Overview placeholder */}
          <Card className="border-border shadow-sm rounded-[2rem] overflow-hidden bg-card">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4">Lời nhắn tới Gia sư</h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {booking.message || "Không có lời nhắn."}
              </p>
            </CardContent>
          </Card>

          {/* Mock Course Content for future expansion */}
          <div className="opacity-50 pointer-events-none">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Lộ trình học (Tính năng đang phát triển)
            </h3>
            <CourseContent course={mockCourseDetail} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%] flex flex-col gap-6">
          <ProgressCircle
            progress={
              sessions.length > 0
                ? (sessions.filter((s) => s.status === "COMPLETED").length /
                    sessions.length) *
                  100
                : 0
            }
            completedLessons={
              sessions.filter((s) => s.status === "COMPLETED").length
            }
            totalLessons={sessions.length}
          />

          <OnlineClassInfo
            mode={booking.mode}
            scheduleRules={booking.scheduleRules || []}
            meetLink={""} // meetLink is currently not in DTO
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
