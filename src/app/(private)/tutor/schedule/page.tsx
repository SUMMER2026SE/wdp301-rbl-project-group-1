"use client";

import Link from "next/link";

import {
  ScheduleCalendar,
  ScheduleHeader,
  TodaySchedule,
  UpcomingClasses,
} from "@/src/features/tutor/schedule/components";
import {
  mockFixedAvailableSlots,
  scheduleClasses,
  todayClasses,
  upcomingClasses,
} from "@/src/features/tutor/schedule/mock-data";
import { ClassFilter } from "@/src/features/tutor/schedule/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/components/ui/tabs";
import { Button } from "@/src/shared/components/ui/button";
import { toast } from "sonner";
import { ChevronRight, Info, Save } from "lucide-react";
import { useState } from "react";

export default function TutorSchedulePage() {
  const [selectedFilter, setSelectedFilter] = useState<ClassFilter>("all");
  const [initialFixedSlots, setInitialFixedSlots] = useState<Record<string, boolean>>(mockFixedAvailableSlots);
  const [fixedSlots, setFixedSlots] = useState<Record<string, boolean>>(mockFixedAvailableSlots);

  const handleNewSchedule = () => {
    console.log("Open new schedule modal");
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
      <div className="layout-content-container flex flex-col max-w-300 flex-1 w-full gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            className="hover:text-primary transition-colors"
            href="/tutor/home"
          >
            Tổng quan
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground font-medium">Lịch dạy</span>
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
            <Tabs defaultValue="weekly" className="w-full flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Lịch giảng dạy</h3>
                  <p className="text-sm text-muted-foreground mt-1">Quản lý lịch học hàng tuần và thiết lập thời gian rảnh cố định.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <TabsList>
                    <TabsTrigger value="weekly">Tuần này</TabsTrigger>
                    <TabsTrigger value="fixed">Cố định</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="weekly" className="m-0">
                <ScheduleCalendar
                  mode="weekly"
                  classes={scheduleClasses}
                  selectedFilter={selectedFilter}
                  onClassClick={() => { }}
                />
              </TabsContent>

              <TabsContent value="fixed" className="m-0 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Nhấn vào các ô thời gian để bật/tắt lịch rảnh cố định. Các lớp học cố định sẽ được hiển thị để bạn tiện theo dõi.
                  </p>
                  <Button 
                    onClick={() => {
                      setInitialFixedSlots(fixedSlots);
                      toast.success("Đã lưu lịch rảnh cố định thành công!");
                    }}
                    disabled={
                      JSON.stringify(Object.entries(initialFixedSlots).filter(([, v]) => v).sort()) === 
                      JSON.stringify(Object.entries(fixedSlots).filter(([, v]) => v).sort())
                    }
                  >
                    <Save className="size-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </div>
                <ScheduleCalendar
                  mode="fixed"
                  classes={scheduleClasses}
                  selectedFilter="all"
                  onClassClick={() => { }}
                  initialAvailableSlots={initialFixedSlots}
                  onAvailableSlotsChange={(slots) => setFixedSlots(slots)}
                />
              </TabsContent>
            </Tabs>

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
