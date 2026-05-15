"use client";

import { Button } from "@/src/shared/components/ui/button";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  ReviewItem as ReviewItemType,
  ReviewMode,
} from "./reviews-section.types";

interface ReviewItemProps {
  item: ReviewItemType;
  mode: ReviewMode;
}

export function ReviewItem({ item, mode }: ReviewItemProps) {
  const [liked, setLiked] = useState(item.liked || false);
  const [likesCount, setLikesCount] = useState(item.likes || 0);

  const handleLike = () => {
    if (!liked) {
      setLikesCount(likesCount + 1);
      setLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setLiked(false);
    }
  };

  if (mode === "reviews") {
    if (!item.author) return null;

    return (
      <div className="border-b border-border pb-6 last:border-0 last:pb-0">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {item.author.avatar ? (
              <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={item.author.avatar}
                  alt={item.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                {item.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-foreground">
                {item.author.name}
              </h4>
              {item.author.role && (
                <p className="text-xs text-muted-foreground">
                  {item.author.role}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            {item.rating && (
              <div className="mb-1 flex items-center gap-0.5 text-warning">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < item.rating! ? "★" : "☆"}</span>
                ))}
              </div>
            )}
            {item.timestamp && (
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
            )}
          </div>
        </div>
        <p className="text-sm font-normal text-muted-foreground">
          {item.content}
        </p>
      </div>
    );
  }

  // Feedback mode
  if (!item.author) return null;

  return (
    <div className="flex gap-4">
      <div className="relative size-10 flex-shrink-0 overflow-hidden rounded-full">
        {item.author.avatar ? (
          <Image
            src={item.author.avatar}
            alt={item.author.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
            {item.author.name.split(" ")[0][0]}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="rounded-xl rounded-tl-none bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-foreground">
                {item.author.name}
              </h4>
              {item.author.isVerified && (
                <BadgeCheck className="size-4 text-info" />
              )}
            </div>
            {item.timestamp && (
              <span className="text-xs text-muted-foreground">
                {item.timestamp}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{item.content}</p>
        </div>

        {/* Actions */}
        <div className="ml-2 mt-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`h-7 gap-1 px-2 text-xs font-medium ${
              liked
                ? "text-primary hover:text-primary"
                : "text-muted-foreground"
            }`}
          >
            <ThumbsUp className={`size-3.5 ${liked ? "fill-primary" : ""}`} />
            {likesCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-medium text-muted-foreground"
          >
            Trả lời
          </Button>
        </div>

        {/* Nested Replies */}
        {item.replies && item.replies.length > 0 && (
          <div className="mt-4 flex flex-col gap-4 border-l border-border pl-4">
            {item.replies.map((reply) => (
              <ReviewItem key={reply.id} item={reply} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
