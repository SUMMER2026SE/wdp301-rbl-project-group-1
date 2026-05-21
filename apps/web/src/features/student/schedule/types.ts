export interface ScheduleClass {
  id: string;
  name: string;
  subject: string;
  tutorName?: string;
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
  tutorName?: string;
  note?: string;
  status?: "happening" | "rescheduletrexd";
}

export interface TodayClass {
  id: string;
  time: string;
  title: string;
  tutorName: string;
  status: "upcoming" | "happening" | "completed";
}

export type ClassFilter = "all" | string;
