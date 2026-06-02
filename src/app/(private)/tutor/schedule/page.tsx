"use client";

import Link from "next/link";

import {
  ScheduleCalendar,
  ScheduleHeader,
} from "@/src/features/tutor/schedule/components";
import { ClassFilter } from "@/src/features/tutor/schedule/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/components/ui/tabs";
import { Button } from "@/src/shared/components/ui/button";
import { toast } from "sonner";
import { ChevronRight, Info, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useGetScheduleAvailabilityQuery,
  useUpdateScheduleAvailabilityMutation,
} from "@/src/features/schedule/scheduleAvailabilityEnhance";
import { mapApiToSlots, mapSlotsToApi } from "@/src/features/schedule/utils/schedule-mapper";
import { useGetMySessionsQuery } from "@/src/features/booking/bookingApi";
import { mapSessionsToScheduleClasses } from "@/src/features/schedule/utils/session-mapper";

export default function TutorSchedulePage() {
  const [selectedFilter, setSelectedFilter] = useState<ClassFilter>("all");
  const { data: availabilityData, isLoading: isFetchingAvailability } = useGetScheduleAvailabilityQuery();
  const [updateAvailability, { isLoading: isUpdatingAvailability }] = useUpdateScheduleAvailabilityMutation();

  const { data: sessionsData, isLoading: isFetchingSessions } = useGetMySessionsQuery({});

  const [initialFixedSlots, setInitialFixedSlots] = useState<Record<string, boolean>>({});
  const [fixedSlots, setFixedSlots] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (availabilityData?.data?.availability) {
      const mappedSlots = mapApiToSlots(availabilityData.data.availability);
      const syncState = () => {
        setInitialFixedSlots(mappedSlots);
        setFixedSlots(mappedSlots);
      };
      syncState();
    }
  }, [availabilityData]);

  const scheduleClasses = sessionsData?.data ? mapSessionsToScheduleClasses(sessionsData.data) : [];

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

        {/* Main Content */}
        <div className="flex flex-col gap-8">
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
                {isFetchingSessions ? (
                  <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin mb-4" />
                    <p>Đang tải dữ liệu lớp học...</p>
                  </div>
                ) : (
                  <ScheduleCalendar
                    mode="weekly"
                    classes={scheduleClasses}
                    selectedFilter={selectedFilter}
                    onClassClick={() => { }}
                  />
                )}
              </TabsContent>

              <TabsContent value="fixed" className="m-0 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Nhấn vào các ô thời gian để bật/tắt lịch rảnh cố định. Các lớp học cố định sẽ được hiển thị để bạn tiện theo dõi.
                  </p>
                  <Button 
                    onClick={async () => {
                      try {
                        const availabilityPayload = mapSlotsToApi(fixedSlots);
                        await updateAvailability({
                          updateScheduleAvailabilityDto: {
                            availability: availabilityPayload,
                          },
                        }).unwrap();
                        setInitialFixedSlots(fixedSlots);
                        toast.success("Đã lưu lịch rảnh cố định thành công!");
                      } catch {
                        toast.error("Đã xảy ra lỗi khi lưu lịch rảnh.");
                      }
                    }}
                    disabled={
                      isUpdatingAvailability ||
                      isFetchingAvailability ||
                      JSON.stringify(Object.entries(initialFixedSlots).filter(([, v]) => v).sort()) === 
                      JSON.stringify(Object.entries(fixedSlots).filter(([, v]) => v).sort())
                    }
                  >
                    {isUpdatingAvailability ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                    Lưu thay đổi
                  </Button>
                </div>
                {isFetchingAvailability ? (
                  <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin mb-4" />
                    <p>Đang tải dữ liệu lịch rảnh...</p>
                  </div>
                ) : (
                  <ScheduleCalendar
                    mode="fixed"
                    classes={scheduleClasses}
                    selectedFilter="all"
                    onClassClick={() => { }}
                    initialAvailableSlots={initialFixedSlots}
                    onAvailableSlotsChange={(slots) => setFixedSlots(slots)}
                  />
                )}
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
        </div>
    </main>
  );
}
