"use client";

import { Button } from "@/src/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Course } from "../types";
import { CourseCard } from "./course-card";

interface SuggestedCoursesCarouselProps {
  courses: Course[];
}

const SCROLL_AMOUNT = 320;

export function SuggestedCoursesCarousel({
  courses,
}: SuggestedCoursesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          Khoá học gợi ý cho bạn
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="size-8 rounded-full"
            aria-label="Kéo trái"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="size-8 rounded-full"
            aria-label="Kéo phải"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {courses.map((course) => (
          <div key={course.id} className="flex-none w-[270px] snap-start">
            <CourseCard course={course} variant="carousel" />
          </div>
        ))}
      </div>
    </section>
  );
}
