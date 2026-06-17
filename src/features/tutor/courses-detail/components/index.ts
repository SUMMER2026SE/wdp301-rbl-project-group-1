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
export { AttendanceStatsSection, PendingAttendanceSection } from "./attendance";
