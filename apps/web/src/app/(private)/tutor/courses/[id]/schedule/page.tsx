"use client";

import {
  FixedSchedule,
  Schedule,
  ScheduleEvent,
  UpcomingEvent,
} from "@/src/features/tutor/courses-detail/components/schedule";

// Mock data for schedule events
const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Cơ bản",
    date: new Date(2026, 2, 2), // March 2, 2026 (Monday)
    time: "09:00",
    endTime: "10:30",
    description: "Bài giảng về hàm số bậc nhất",
    color: "blue",
  },
  {
    id: "2",
    title: "Cơ bản",
    date: new Date(2026, 2, 5), // March 5, 2026 (Thursday)
    time: "18:00",
    endTime: "19:30",
    description: "Ôn tập và luyện tập",
    color: "blue",
  },
  {
    id: "3",
    title: "Cơ bản",
    date: new Date(2026, 2, 8), // March 8, 2026 (Sunday)
    time: "09:00",
    endTime: "10:30",
    description: "Hàm số bậc hai",
    color: "blue",
  },
  {
    id: "4",
    title: "Cơ bản",
    date: new Date(2026, 2, 12), // March 12, 2026 (Thursday)
    time: "18:00",
    endTime: "19:30",
    description: "Luyện tập hàm số bậc hai",
    color: "blue",
  },
  {
    id: "5",
    title: "Cơ bản",
    date: new Date(2026, 2, 15), // March 15, 2026 (Sunday)
    time: "09:00",
    endTime: "10:30",
    description: "Phương trình bậc nhất",
    color: "blue",
  },
  {
    id: "6",
    title: "Cơ bản",
    date: new Date(2026, 2, 19), // March 19, 2026 (Thursday)
    time: "18:00",
    endTime: "19:30",
    description: "Hệ phương trình",
    color: "blue",
  },
  {
    id: "7",
    title: "Học bù",
    date: new Date(2026, 2, 21), // March 21, 2026 (Saturday)
    time: "18:45",
    endTime: "20:15",
    description: "Buổi học bù cho buổi bỏ lỡ",
    color: "orange",
  },
  {
    id: "8",
    title: "Cơ bản",
    date: new Date(2026, 2, 22), // March 22, 2026 (Sunday)
    time: "09:00",
    endTime: "10:30",
    description: "Bất phương trình",
    color: "blue",
  },
  {
    id: "9",
    title: "Cơ bản",
    date: new Date(2026, 2, 26), // March 26, 2026 (Thursday)
    time: "18:00",
    endTime: "19:30",
    description: "Hệ bất phương trình",
    color: "blue",
  },
  {
    id: "10",
    title: "Cơ bản",
    date: new Date(2026, 2, 29), // March 29, 2026 (Sunday)
    time: "09:00",
    endTime: "10:30",
    description: "Ôn tập tổng hợp",
    color: "blue",
  },
  {
    id: "11",
    title: "Cơ bản",
    date: new Date(2026, 3, 2), // April 2, 2026 (Thursday)
    time: "18:00",
    endTime: "19:30",
    description: "Kiểm tra giữa kỳ",
    color: "blue",
  },
];

const mockFixedSchedule: FixedSchedule[] = [
  {
    id: "1",
    day: "T5",
    time: "18:00 - 19:30",
    dayOfWeek: "Hàng tuần",
  },
  {
    id: "2",
    day: "CN",
    time: "09:00 - 10:30",
    dayOfWeek: "Hàng tuần",
  },
];

const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: "1",
    date: "Hôm nay, 5/3",
    time: "18:00 - 19:30",
    title: "Hàm số bậc hai - Luyện tập",
    status: "happening",
    teacher: "Thầy Đỗ",
  },
  {
    id: "2",
    date: "CN, 8/3",
    time: "09:00 - 10:30",
    title: "Hàm số bậc hai",
    note: "Thay đổi",
    status: "changed",
  },
  {
    id: "3",
    date: "T5, 12/3",
    time: "18:00 - 19:30",
    title: "Luyện tập hàm số bậc hai",
    status: "changed",
  },
];

export default function CoursesSchedulePage() {
  const handleEditFixedSchedule = (schedule: FixedSchedule) => {
    console.log("Edit schedule:", schedule);
    // TODO: Implement edit modal
  };

  const handleAddSlot = () => {
    console.log("Add new time slot");
    // TODO: Implement add modal
  };

  const handleCancelClass = (eventId: string) => {
    console.log("Cancel class:", eventId);
    // TODO: Implement cancel logic
  };

  const handleEventClick = (event: ScheduleEvent) => {
    console.log("Event clicked:", event);
    // TODO: Can implement additional actions here
  };

  return (
    <Schedule
      events={mockEvents}
      fixedSchedule={mockFixedSchedule}
      upcomingEvents={mockUpcomingEvents}
      onEditFixedSchedule={handleEditFixedSchedule}
      onAddSlot={handleAddSlot}
      onCancelClass={handleCancelClass}
      onEventClick={handleEventClick}
    />
  );
}
