export interface Folder {
  id: string;
  name: string;
  icon: string;
  iconColor: "blue" | "orange" | "green";
  fileCount: number;
}

export interface ResourceDocument {
  id: string;
  name: string;
  type: "pdf" | "doc" | "xlsx" | "other";
  size: string;
  category: string;
  subject?: string;
  className?: string;
  uploadDate: string;
  views: number;
}

export interface CourseResources {
  courseId: string;
  courseName: string;
  resourceCount: number;
}

export interface UploadResourceFormData {
  fileName: string;
  folder: string;
  classId: string;
  description: string;
  file?: File;
}

export const resourceFolders = [
  { value: "general", label: "Tài liệu chung" },
  { value: "homework", label: "Bài tập về nhà" },
  { value: "test", label: "Đề kiểm tra" },
];

export const resourceClasses = [
  { value: "all", label: "Tất cả lớp học" },
  { value: "class1", label: "Toán 10 - Nhóm A" },
  { value: "class2", label: "Toán 10 - Nhóm B" },
  { value: "class3", label: "Lý 12 - Luyện thi ĐH" },
];
