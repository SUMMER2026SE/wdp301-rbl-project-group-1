"use client";

import SearchBox from "@/src/shared/components/molecules/search-box/search-box";
import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import {
  ClipboardList,
  MessageSquare,
  NotebookPen,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export interface Student {
  id: string;
  name: string;
  email: string;
  absences: number;
  averageScore: number;
  avatar?: string;
}

interface StudentManagementSectionProps {
  students: Student[];
}

interface SearchFormValues {
  search: string;
}

const filterOptions = [
  "Tất cả",
  "Học lực: Giỏi",
  "Học lực: Khá",
  "Học lực: TB",
  "Chuyên cần",
];

export function StudentManagementSection({
  students,
}: StudentManagementSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");

  const { control } = useForm<SearchFormValues>({
    defaultValues: { search: "" },
  });

  const searchTerm = useWatch({ control, name: "search" });

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes((searchTerm ?? "").toLowerCase()) ||
      student.email.toLowerCase().includes((searchTerm ?? "").toLowerCase()),
  );

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 7) return "text-blue-600 dark:text-blue-400";
    if (score >= 5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Add Button */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <SearchBox
                value={field.value}
                onChange={field.onChange}
                placeholder="Tìm kiếm học sinh..."
                className="w-full sm:w-80"
              />
            )}
          />
          <Button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors w-full sm:w-auto">
            <UserPlus className="size-5" />
            <span>Thêm học sinh vào lớp</span>
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
            Lọc theo:
          </span>
          {filterOptions.map((option) => (
            <Button
              key={option}
              variant={option === selectedFilter ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option)}
              className="rounded-full whitespace-nowrap"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                Học sinh
              </th>
              <th className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                Số buổi vắng
              </th>
              <th className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                Điểm TB bài tập
              </th>
              <th className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 flex-shrink-0">
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-semibold">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {student.absences > 0 && (
                    <span className="text-red-500 dark:text-red-400 font-bold">
                      {student.absences}
                    </span>
                  )}
                  {student.absences === 0 && <span>{student.absences}</span>}
                </td>
                <td
                  className={`px-5 py-4 text-sm font-bold ${getScoreColor(student.averageScore)}`}
                >
                  {student.averageScore.toFixed(1)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Nhắn tin"
                    >
                      <MessageSquare className="size-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Xem hồ sơ học tập"
                    >
                      <ClipboardList className="size-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Ghi chú riêng"
                    >
                      <NotebookPen className="size-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
