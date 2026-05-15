"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { ReviewItem } from "./review-item";
import { ReviewsSectionProps } from "./reviews-section.types";

export function ReviewsSection({
  items,
  totalItems,
  mode = "feedback",
  onAddItem,
  title,
  rating = 0,
  onFilterRating,
}: ReviewsSectionProps) {
  const [newContent, setNewContent] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleAddItem = () => {
    if (newContent.trim()) {
      onAddItem?.(newContent);
      setNewContent("");
    }
  };

  const handleRatingFilter = (ratingValue: number | null) => {
    setSelectedRating(ratingValue);
    onFilterRating?.(ratingValue);
  };

  const defaultTitle =
    mode === "reviews" ? "Đánh giá" : "Bình luận & Thảo luận";
  const displayTitle = title || defaultTitle;

  const filteredItems =
    mode === "reviews" && selectedRating !== null
      ? items.filter((item) => item.rating === selectedRating)
      : items;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          {displayTitle} ({totalItems})
        </h2>
        {mode === "reviews" && rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-current" />
            <span className="text-lg font-bold text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
        )}
      </div>

      {/* Rating filter for reviews mode */}
      {mode === "reviews" && (
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant={selectedRating === null ? "default" : "outline"}
            onClick={() => handleRatingFilter(null)}
            className="rounded-full whitespace-nowrap"
          >
            Tất cả
          </Button>
          {[5, 4, 3].map((star) => {
            const count = items.filter((r) => r.rating === star).length;
            return (
              <Button
                key={star}
                size="sm"
                variant={selectedRating === star ? "default" : "outline"}
                onClick={() => handleRatingFilter(star)}
                className="rounded-full whitespace-nowrap"
              >
                {star} Sao ({count})
              </Button>
            );
          })}
        </div>
      )}

      {/* Add content form */}
      {mode === "feedback" && (
        <div className="mb-8 flex gap-4">
          <div className="size-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
            <div className="flex size-full items-center justify-center text-xs font-bold text-muted-foreground">
              MH
            </div>
          </div>
          <div className="flex-1">
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Thêm bình luận của bạn..."
              className="mb-3"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddItem}
                disabled={!newContent.trim()}
                size="sm"
              >
                Bình luận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items list */}
      <div
        className={mode === "feedback" ? "flex flex-col gap-6" : "space-y-6"}
      >
        {filteredItems.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            {mode === "reviews"
              ? "Không có đánh giá cho số sao này"
              : "Chưa có bình luận nào"}
          </p>
        ) : (
          filteredItems.map((item) => (
            <ReviewItem key={item.id} item={item} mode={mode} />
          ))
        )}
      </div>
    </div>
  );
}
