"use client";

import {
  ScheduleCalendar,
  ScheduleHeader,
  TodaySchedule,
  UpcomingClasses,
} from "@/src/features/tutor/schedule/components";
import {
  scheduleClasses,
  todayClasses,
  upcomingClasses,
} from "@/src/features/tutor/schedule/mock-data";
import { ClassFilter } from "@/src/features/tutor/schedule/types";
import { ChevronRight, Info } from "lucide-react";
import { useState } from "react";

export default function TutorSchedulePage() {
  const [selectedFilter, setSelectedFilter] = useState<ClassFilter>("all");

  const handleNewSchedule = () => {
    console.log("Open new schedule modal");
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-300 flex-1 w-full gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            className="hover:text-primary transition-colors"
            href="/tutor/home"
          >
            Tổng quan
          </a>
          <ChevronRight className="size-4" />
          <span className="text-foreground font-medium">
            Lịch dạy
          </span>
        </div>

        {/* Header Section */}
        <ScheduleHeader
          selectedFilter={selectedFilter}
          onClassFilterChange={setSelectedFilter}
          onNewScheduleClick={handleNewSchedule}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Calendar */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ScheduleCalendar
              classes={scheduleClasses}
              selectedFilter={selectedFilter}
              onClassClick={() => {}}
            />

            {/* Info Banner */}
            <div className="rounded-xl border border-border bg-schedule-blue-light/50 p-4 flex gap-3">
              <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                <Info className="size-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Thông báo biến động lịch
                </h4>
                <p className="text-sm text-muted-foreground">
                  Hệ thống sẽ tự động gửi email và thông báo ứng dụng cho học
                  sinh khi bạn thực hiện các thay đổi về lịch học.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Sidebar */}
          <div className="flex flex-col gap-8">
            <TodaySchedule classes={todayClasses} />
            <UpcomingClasses classes={upcomingClasses} />
          </div>
        </div>
      </div>
    </main>
  );
}
