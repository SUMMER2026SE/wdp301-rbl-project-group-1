// Layout-level (used across multiple sections)
export { HeaderSection } from "./header-section";
export { TabsSection } from "./tabs-section";
export type { TabsItemProps, TabsSectionProps } from "./tabs-section";

// Tổng quan
export {
  ClassNotesSection,
  ClassResourcesSection,
  StartSessionButton,
  TopScoresSection,
} from "./overview";
export type { ClassResource, TopStudent } from "./overview";

// Học sinh
export { StudentManagementSection } from "./students";
export type { Student } from "./students";

// Lịch học
export { Schedule } from "./schedule";
export type { FixedSchedule, ScheduleEvent, UpcomingEvent } from "./schedule";

// Tài liệu & Bài Tập
export {
  AssignmentCard,
  AssignmentsSection,
  DocumentCard,
  DocumentsSection,
  ScoreStatsSection,
} from "./resources";
export type { DocumentCardProps, DocumentIconType } from "./resources";

// Điểm danh
export { AttendanceStatsSection } from "./attendance";
