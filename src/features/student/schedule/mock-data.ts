import { ScheduleClass, TodayClass, UpcomingClass } from "./types";

export const scheduleClasses: ScheduleClass[] = [
  {
    id: "class-1",
    name: "Toán 10 - Nhóm A",
    subject: "Math",
    tutorName: "Thầy Nguyễn Văn A",
    time: "09:00",
    endTime: "10:30",
    color: "blue",
  },
  {
    id: "class-2",
    name: "Lý 12 - Kèm 1:1",
    subject: "Physics",
    tutorName: "Thầy Phạm Hữu B",
    time: "15:00",
    endTime: "16:30",
    color: "purple",
  },
  {
    id: "class-3",
    name: "Hóa 11 - Nâng cao",
    subject: "Chemistry",
    tutorName: "Cô Trần Thị C",
    time: "19:30",
    endTime: "21:00",
    color: "emerald",
  },
  {
    id: "class-4",
    name: "Toán 10 - Nhóm A",
    subject: "Math",
    tutorName: "Thầy Nguyễn Văn A",
    time: "18:00",
    endTime: "19:30",
    color: "blue",
  },
  {
    id: "class-5",
    name: "Toán 10 - Nhóm A",
    subject: "Math",
    tutorName: "Thầy Nguyễn Văn A",
    time: "09:00",
    endTime: "10:30",
    color: "blue",
  },
  {
    id: "class-6",
    name: "Lý 12 - Kèm 1:1",
    subject: "Physics",
    tutorName: "Thầy Phạm Hữu B",
    time: "15:00",
    endTime: "16:30",
    color: "purple",
  },
  {
    id: "class-7",
    name: "Hóa 11 - Nâng cao",
    subject: "Chemistry",
    tutorName: "Cô Trần Thị C",
    time: "19:30",
    endTime: "21:00",
    color: "emerald",
  },
];

export const availableClasses = [
  { value: "all", label: "Tất cả lớp học" },
  { value: "math10", label: "Toán 10 - Nhóm A" },
  { value: "physics12", label: "Lý 12 - Kèm 1:1" },
  { value: "chem11", label: "Hóa 11 - Nâng cao" },
];

export const todayClasses: TodayClass[] = [
  {
    id: "today-1",
    time: "18:00 - 19:30",
    title: "Toán 10 - Nhóm A",
    tutorName: "Thầy Nguyễn Văn A",
    status: "upcoming",
  },
  {
    id: "today-2",
    time: "20:00 - 21:30",
    title: "Hóa 11 - Nâng cao",
    tutorName: "Cô Trần Thị C",
    status: "upcoming",
  },
];

export const upcomingClasses: UpcomingClass[] = [
  {
    id: "upcoming-1",
    date: "T5, 28/10",
    time: "19:45",
    endTime: "21:15",
    title: "Toán 10",
    tutorName: "Thầy Nguyễn Văn A",
    note: "Học bổ sung ngày 12/10",
    status: "happening",
  },
  {
    id: "upcoming-2",
    date: "T6, 29/10",
    time: "20:00",
    endTime: "21:30",
    title: "Hóa 11",
    tutorName: "Cô Trần Thị C",
    status: "rescheduletrexd",
  },
];

export const classColorMap: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  blue: {
    bg: "bg-[color:var(--schedule-blue-light)]",
    border: "border-[color:var(--schedule-blue-border)]",
    text: "text-[color:var(--schedule-blue-text)]",
  },
  purple: {
    bg: "bg-[color:var(--schedule-purple-light)]",
    border: "border-[color:var(--schedule-purple-border)]",
    text: "text-[color:var(--schedule-purple-text)]",
  },
  emerald: {
    bg: "bg-[color:var(--schedule-emerald-light)]",
    border: "border-[color:var(--schedule-emerald-border)]",
    text: "text-[color:var(--schedule-emerald-text)]",
  },
  orange: {
    bg: "bg-[color:var(--schedule-orange-light)]",
    border: "border-[color:var(--schedule-orange-border)]",
    text: "text-[color:var(--schedule-orange-text)]",
  },
};

// Mock data mapper - maps dates to classes for demo
export const getClassesForDate = (
  date: Date,
  allClasses: ScheduleClass[],
): ScheduleClass[] => {
  const day = date.getDate();
  const classDistribution: Record<number, ScheduleClass[]> = {
    1: [allClasses[0]],
    2: [allClasses[1]],
    4: [allClasses[2]],
    5: [allClasses[3]],
    8: [allClasses[0], allClasses[1]],
    9: [allClasses[1]],
    11: [allClasses[2]],
    12: [allClasses[3]],
    18: [allClasses[0]],
    19: [allClasses[1]],
    25: [allClasses[0]],
    26: [allClasses[1]],
    28: [allClasses[2]],
    30: [allClasses[1]],
  };
  return classDistribution[day] || [];
};

// Mock data mapper for fixed mode - maps day of week to classes
export const getFixedClassesForDate = (
  date: Date,
  allClasses: ScheduleClass[],
): ScheduleClass[] => {
  const jsDay = date.getDay();
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1; // 0=Mon, 6=Sun
  
  const fixedDistribution: Record<number, ScheduleClass[]> = {
    0: [allClasses[0]], // Mon
    1: [allClasses[1]], // Tue
    3: [allClasses[2]], // Thu
    4: [allClasses[3]], // Fri
  };
  
  return fixedDistribution[dayIndex] || [];
};

export const mockFixedAvailableSlots: Record<string, boolean> = {};
