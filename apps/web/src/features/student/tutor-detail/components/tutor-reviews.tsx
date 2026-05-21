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
}

export function TutorReviews({
  reviews,
  rating,
  reviewCount,
}: TutorReviewsProps) {
  // Map từ TutorReview sang ReviewItem
  const mappedReviews: ReviewItem[] = reviews.map((review) => ({
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
