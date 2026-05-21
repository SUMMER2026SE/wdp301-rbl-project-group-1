"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import type { Review } from "../types";

interface TutorReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function TutorReviews({
  reviews,
  rating,
  reviewCount,
}: TutorReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredReviews =
    selectedRating === null
      ? reviews
      : reviews.filter((r) => r.rating === selectedRating);

  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          Đánh giá từ học viên ({reviewCount})
        </h2>
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-current" />
          <span className="text-lg font-bold text-foreground">{rating}</span>
          <span className="text-muted-foreground text-sm">/ 5</span>
        </div>
      </div>

      {/* Rating filter buttons */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedRating(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedRating === null
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card hover:bg-muted text-foreground"
          }`}
        >
          Tất cả
        </button>
        {[5, 4, 3].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          return (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedRating === star
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card hover:bg-muted text-foreground"
              }`}
            >
              {star} Sao ({count})
            </button>
          );
        })}
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Không có đánh giá cho số sao này
          </p>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-border pb-6 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                    {review.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">
                      {review.studentName}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {review.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-warning mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {review.createdAt}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm font-normal">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
