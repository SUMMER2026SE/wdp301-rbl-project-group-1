import { CourseResources, Folder, ResourceDocument } from "./types";

export const mockFolders: Folder[] = [
  {
    id: "1",
    name: "Tài liệu chung",
    icon: "folder_shared",
    iconColor: "blue",
    fileCount: 24,
  },
  {
    id: "2",
    name: "Bài tập về nhà",
    icon: "assignment",
    iconColor: "orange",
    fileCount: 15,
  },
  {
    id: "3",
    name: "Đề kiểm tra",
    icon: "quiz",
    iconColor: "green",
    fileCount: 8,
  },
];

export const mockRecentResources: ResourceDocument[] = [
  {
    id: "1",
    name: "De_cuong_on_tap_Toan_10_Giua_Ki_1.pdf",
    type: "pdf",
    size: "2.4 MB",
    category: "Tài liệu chung",
    subject: "Toán học",
    className: "Toán 10 - Lớp A1",
    uploadDate: "20/10/2023",
    views: 12,
  },
  {
    id: "2",
    name: "Bai_tap_ve_nha_Dai_so_Tuyen_tinh.docx",
    type: "doc",
    size: "1.1 MB",
    category: "Bài tập về nhà",
    subject: "Toán học",
    className: "Toán 11 - Lớp B2",
    uploadDate: "18/10/2023",
    views: 5,
  },
  {
    id: "3",
    name: "Bang_diem_danh_gia_nang_luc_thang_9.xlsx",
    type: "xlsx",
    size: "0.5 MB",
    category: "Đề kiểm tra",
    subject: "Toán học",
    className: "Toán 12 - Lớp C3",
    uploadDate: "15/10/2023",
    views: 8,
  },
  {
    id: "4",
    name: "De_thi_thu_Dai_hoc_mon_Toan_Lan_1.pdf",
    type: "pdf",
    size: "3.2 MB",
    category: "Đề kiểm tra",
    subject: "Toán học",
    className: "Toán 12 - Lớp C3",
    uploadDate: "10/10/2023",
    views: 25,
  },
];

export const mockCourseResources: CourseResources[] = [
  {
    courseId: "1",
    courseName: "Toán 10 - Lớp A1",
    resourceCount: 15,
  },
  {
    courseId: "2",
    courseName: "Toán 11 - Lớp B2",
    resourceCount: 12,
  },
  {
    courseId: "3",
    courseName: "Toán 12 - Lớp C3",
    resourceCount: 18,
  },
];
