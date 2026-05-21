export interface TodayClassItem {
  id: string;
  time: string;
  title: string;
  status: "upcoming" | "happening" | "completed";
  /** Displayed below the title. E.g. tutor name or subject */
  subtitle?: string;
  /** Extra info line. E.g. student count text */
  meta?: string;
}

export interface UpcomingClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  status?: "happening" | string;
  /** Extra info line below the date. E.g. GV name or student name */
  subtitle?: string;
  note?: string;
}
