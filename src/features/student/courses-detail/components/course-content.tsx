"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/shared/components/ui/accordion";
import { Course } from "../../types";
import { LessonItem } from "./lesson-item";

interface CourseContentProps {
  course: Course;
}

export function CourseContent({ course }: CourseContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-foreground">Nội dung khóa học</h2>
      <Accordion type="multiple" className="w-full space-y-4">
        {course.chapters.map((chapter) => (
          <AccordionItem
            key={chapter.id}
            value={chapter.id}
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            <AccordionTrigger className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 transition-colors hover:no-underline [&[data-state=open]]:bg-muted/50 [&>[data-slot=accordion-trigger-icon]]:ml-0">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-md">
                  {chapter.number}
                </div>
                <span className="font-black text-foreground text-left text-base">
                  {chapter.title}
                </span>
              </div>

              {/* RIGHT → đẩy sát chevron */}
              <span className="ml-auto text-sm text-muted-foreground">
                {chapter.lessons.length} Bài học
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-0 border-t border-border bg-card">
              {chapter.lessons.length > 0 ? (
                chapter.lessons.map((lesson, idx) => (
                  <LessonItem key={lesson.id} lesson={lesson} index={idx} />
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nội dung chưa khả dụng.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
