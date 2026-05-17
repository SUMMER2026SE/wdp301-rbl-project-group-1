"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import {
  Ban,
  CheckCheck,
  Clock,
  Info,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

interface Student {
  id: string;
  name: string;
  code: string;
  initials: string;
}

interface Session {
  id: string;
  date: string;
  time: string;
}

type AttendanceStatus = "present" | "late" | "excused" | "absent";

interface AttendanceRecord {
  status: AttendanceStatus;
  note: string;
}

interface AttendanceFormValues {
  sessionId: string;
  records: Record<string, AttendanceRecord>;
}

const mockStudents: Student[] = [
  { id: "1", name: "Nguyễn Văn An", code: "HS001", initials: "AN" },
  { id: "2", name: "Trần Thị Bình", code: "HS002", initials: "BÌ" },
  { id: "3", name: "Lê Văn Châu", code: "HS003", initials: "CH" },
  { id: "4", name: "Phạm Thị Dung", code: "HS004", initials: "DU" },
  { id: "5", name: "Hoàng Văn Em", code: "HS005", initials: "EM" },
];

const mockSessions: Session[] = [
  { id: "1", date: "Hôm nay (5/3/2026)", time: "18:00 - 19:30" },
  { id: "2", date: "Chủ nhật, 2/3/2026", time: "09:00 - 10:30" },
  { id: "3", date: "Thứ năm, 26/2/2026", time: "18:00 - 19:30" },
  { id: "4", date: "Thứ ba, 24/2/2026", time: "18:00 - 19:30" },
  { id: "5", date: "Chủ nhật, 22/2/2026", time: "09:00 - 10:30" },
];

const defaultRecords: Record<string, AttendanceRecord> = {
  "1": { status: "present", note: "" },
  "2": { status: "present", note: "" },
  "3": { status: "excused", note: "Xin phép ốm từ hôm qua" },
  "4": { status: "absent", note: "" },
  "5": { status: "late", note: "" },
};

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: "present", label: "Có mặt" },
  { value: "late", label: "Muộn" },
  { value: "excused", label: "Có phép" },
  { value: "absent", label: "Không phép" },
];

export default function AttendancePage() {
  const { control, handleSubmit } = useForm<AttendanceFormValues>({
    defaultValues: {
      sessionId: "1",
      records: defaultRecords,
    },
  });

  const records = useWatch({ control, name: "records" });

  const stats = {
    total: mockStudents.length,
    present: Object.values(records ?? {}).filter((r) => r.status === "present")
      .length,
    late: Object.values(records ?? {}).filter((r) => r.status === "late")
      .length,
    absent: Object.values(records ?? {}).filter((r) => r.status === "absent")
      .length,
    excused: Object.values(records ?? {}).filter((r) => r.status === "excused")
      .length,
  };

  const onSubmit = (data: AttendanceFormValues) => {
    console.log("Save attendance:", data);
    // TODO: Implement API call to save attendance
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row gap-8"
    >
      <div className="flex-1 flex flex-col gap-6">
        {/* Session Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
              Chọn buổi học:
            </span>
            <Controller
              name="sessionId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="flex-1 sm:w-64">
                    <SelectValue placeholder="Chọn buổi học" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Info className="size-5" />
            <span>Buổi 12 / Tổng 24 buổi</span>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Học sinh
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-900 dark:text-white text-center">
                    Trạng thái
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Ghi chú buổi học
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {mockStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                          {student.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {student.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status Radio Buttons */}
                    <td className="p-4">
                      <Controller
                        name={`records.${student.id}.status`}
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            {statusOptions.map((opt) => (
                              <label
                                key={opt.value}
                                className="flex items-center gap-1 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`status_${student.id}`}
                                  value={opt.value}
                                  checked={field.value === opt.value}
                                  onChange={() => field.onChange(opt.value)}
                                  className="w-4 h-4 border-slate-300 dark:border-slate-600 accent-primary"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                  {opt.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </td>

                    {/* Note Input */}
                    <td className="p-4">
                      <Controller
                        name={`records.${student.id}.note`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Thêm ghi chú..."
                            className="w-full h-9"
                          />
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="flex items-center gap-2 rounded-lg h-11 px-6 bg-primary hover:bg-blue-600 text-white font-bold transition-colors"
          >
            <Save className="size-5" />
            <span>Lưu điểm danh</span>
          </Button>
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="w-full lg:w-80">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden sticky top-24">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Thống kê buổi học
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Users className="size-4 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Tổng số
                </span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {stats.total}
              </span>
            </div>

            {/* Present */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-green-200 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCheck className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-green-700 dark:text-green-400 font-medium">
                  Hiện diện
                </span>
              </div>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {stats.present}
              </span>
            </div>

            {/* Late */}
            {stats.late > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-yellow-200 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="size-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                    Muộn
                  </span>
                </div>
                <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.late}
                </span>
              </div>
            )}

            {/* Excused */}
            {stats.excused > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-blue-200 dark:bg-blue-900/30 flex items-center justify-center">
                    <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-blue-700 dark:text-blue-400 font-medium">
                    Có phép
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.excused}
                </span>
              </div>
            )}

            {/* Absent */}
            {stats.absent > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-red-200 dark:bg-red-900/30 flex items-center justify-center">
                    <Ban className="size-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-red-700 dark:text-red-400 font-medium">
                    Vắng
                  </span>
                </div>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                  {stats.absent}
                </span>
              </div>
            )}

            {/* Note */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="mb-2 font-medium">
                * Lưu ý theo giờ các cộ phép và không phép. Học sinh đề muốn
                được tính là hiện diện.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
