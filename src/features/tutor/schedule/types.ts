export interface ScheduleClass {
  id: string;
  name: string;
  subject: string;
  time: string;
  endTime: string;
  color: "blue" | "purple" | "emerald" | "orange";
}

export interface DaySchedule {
  date: Date;
  classes: ScheduleClass[];
}

export interface UpcomingClass {
  id: string;
  date: string;
  time: string;
  endTime: string;
  title: string;
  studentName?: string;
  note?: string;
  status?: "happening" | "changed";
}

export interface TodayClass {
  id: string;
  time: string;
  title: string;
  subject: string;
  studentCount?: number;
  status: "upcoming" | "happening" | "completed";
}

export type ClassFilter = "all" | string;
