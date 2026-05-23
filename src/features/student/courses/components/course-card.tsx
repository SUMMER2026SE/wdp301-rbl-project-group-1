"use client";

import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/lib/utils";
import { Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "../types";

// Static gradient map keyed by subject — ensures Tailwind scans these classes
const SUBJECT_GRADIENTS: Record<string, string> = {
  "Toán học": "from-blue-500/30 via-indigo-400/20 to-blue-300/20",
  "Vật lý": "from-purple-500/30 via-violet-400/20 to-indigo-300/20",
  "Tiếng Anh": "from-emerald-500/30 via-teal-400/20 to-green-300/20",
  "Hóa học": "from-orange-500/30 via-amber-400/20 to-yellow-300/20",
  "Lập trình": "from-sky-500/30 via-blue-400/20 to-cyan-300/20",
  "Kỹ năng mềm": "from-rose-500/30 via-pink-400/20 to-orange-300/20",
  "Ngữ văn": "from-lime-500/30 via-green-400/20 to-emerald-300/20",
  "Sinh học": "from-teal-500/30 via-emerald-400/20 to-green-300/20",
};

const DEFAULT_GRADIENT = "from-primary/30 via-info/20 to-secondary/20";

interface CourseCardProps {
  course: Course;
  /**
   * carousel — compact layout for the suggested courses section
   * grid     — full layout for search results with CTA buttons
   */
  variant?: "carousel" | "grid";
  className?: string;
}

export function CourseCard({
  course,
  variant = "grid",
  className,
}: CourseCardProps) {
  const isCarousel = variant === "carousel";
  const gradient = SUBJECT_GRADIENTS[course.subject] ?? DEFAULT_GRADIENT;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col h-full",
        className,
      )}
    >
      {/* ── Thumbnail ── */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* Gradient placeholder */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

        {/* Overlay badges */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          {/* Top row: status + subject (left) — rating (right) */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {/* Status badge — only when course has a status */}
              {course.status && (
                <Badge
                  className={cn(
                    "text-[10px] font-bold border-none w-fit px-2 py-0.5",
                    course.status === "hot"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-info text-info-foreground",
                  )}
                >
                  {course.status === "hot" ? "HOT" : "GỢI Ý"}
                </Badge>
              )}
              {/* Subject badge */}
              <Badge
                variant="secondary"
                className="bg-background/80 text-foreground text-[10px] font-semibold w-fit backdrop-blur-sm px-2 py-0.5 uppercase tracking-wide"
              >
                {course.subject}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1">
              <Star className="size-3 fill-warning text-warning" />
              <span className="text-xs font-bold text-foreground">
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Bottom: format badge — only in grid variant */}
          {!isCarousel && (
            <div>
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur-sm text-[10px] font-semibold border-border/60"
              >
                {course.format === "online" ? "TRỰC TUYẾN" : "OFFLINE"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* ── Card body ── */}
      <div
        className={cn("flex flex-col flex-1 gap-2", isCarousel ? "p-3" : "p-4")}
      >
        {/* Title */}
        <h3
          className={cn(
            "font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
            isCarousel ? "text-sm leading-snug" : "text-base",
          )}
        >
          {course.title}
        </h3>

        {/* Description — grid only */}
        {!isCarousel && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <div className="relative size-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={course.instructor.avatarUrl}
              alt={course.instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "font-medium text-foreground truncate",
                isCarousel ? "text-[11px]" : "text-xs",
              )}
            >
              {course.instructor.name}
            </p>
            {!isCarousel && course.instructor.role && (
              <p className="text-[11px] text-muted-foreground truncate">
                {course.instructor.role}
              </p>
            )}
          </div>
        </div>

        {/* Student count — grid only */}
        {!isCarousel && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            <span>{course.studentCount.toLocaleString("vi-VN")} học viên</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <p
            className={cn(
              "font-bold text-primary",
              isCarousel ? "text-sm" : "text-lg",
            )}
          >
            {course.price.toLocaleString("vi-VN")}đ
          </p>
        </div>

        {/* CTA buttons — grid only */}
        {!isCarousel && (
          <div className="flex gap-2 mt-1">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8"
            >
              <Link href={`/student/courses/${course.id}`}>Xem chi tiết</Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Đăng ký ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
