"use client";

import type { ReviewItem } from "@/src/shared/components/organisms/reviews";
import { ReviewsSection } from "@/src/shared/components/organisms/reviews";

interface TutorReview {
  id: string;
  studentName: string;
  role: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface TutorReviewsProps {
  reviews: TutorReview[];
  rating: number;
  reviewCount: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function TutorReviews({
  reviews,
  rating,
  reviewCount,
  isLoading = false,
  isError = false,
}: TutorReviewsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">Đang tải đánh giá...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-destructive">Không thể tải danh sách đánh giá.</p>
      </div>
    );
  }

  // Map từ TutorReview sang ReviewItem
  const mappedReviews: ReviewItem[] = reviews
    .filter((review) => review.content.trim().length > 0)
    .map((review) => ({
      id: review.id,
      author: {
        name: review.studentName,
        role: review.role,
      },
      content: review.content,
      timestamp: review.createdAt,
      rating: review.rating,
    }));

  return (
    <ReviewsSection
      items={mappedReviews}
      totalItems={reviewCount}
      mode="reviews"
      rating={rating}
      onFilterRating={() => {}}
      title="Đánh giá từ học viên"
    />
  );
}
