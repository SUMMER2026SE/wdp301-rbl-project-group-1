"use client";

import type { ReviewItem } from "@/src/shared/components/organisms/reviews";
import { ReviewsSection } from "@/src/shared/components/organisms/reviews";

interface CommentsSectionProps {
  comments: ReviewItem[];
  totalComments: number;
  onAddComment?: (comment: string) => void;
}

export function CommentsSection({
  comments,
  totalComments,
  onAddComment,
}: CommentsSectionProps) {
  return (
    <ReviewsSection
      items={comments}
      totalItems={totalComments}
      mode="feedback"
      onAddItem={onAddComment}
      title="Bình luận & Thảo luận"
    />
  );
}
