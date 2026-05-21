"use client";

import { StudentManagementSection } from "@/src/features/tutor/courses-detail/components";

// Mock student data
const mockStudents = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    absences: 0,
    averageScore: 8.5,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    absences: 1,
    averageScore: 7.2,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@gmail.com",
    absences: 3,
    averageScore: 5.5,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@gmail.com",
    absences: 0,
    averageScore: 9.0,
  },
];

export default function StudentPage() {
  return <StudentManagementSection students={mockStudents} />;
}
