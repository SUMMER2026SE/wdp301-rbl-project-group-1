"use client";

import { Button } from "@/src/shared/components/ui/button";

interface AttendanceData {
  totalSessions: number;
  attendanceRate: number;
  lateCount: number;
  absentCount: number;
  totalStudents: number;
  lastSessionAttendance: number;
}

interface AttendanceStatsProps {
  data: AttendanceData;
}

export function AttendanceStatsSection({ data }: AttendanceStatsProps) {
  const progressPercentage =
    (data.lastSessionAttendance / data.totalStudents) * 100;

  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Thống kê chuyên cần (Tháng này)
        </h2>
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold p-0 h-auto"
        >
          Xem chi tiết
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
            Tổng số buổi
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {data.totalSessions}
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
          <p className="text-green-600 dark:text-green-400 text-xs font-semibold mb-1 uppercase tracking-wider">
            Tỉ lệ có mặt
          </p>
          <p className="text-2xl font-black text-green-700 dark:text-green-300">
            {data.attendanceRate}%
          </p>
        </div>

        {/* Late Count */}
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
          <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold mb-1 uppercase tracking-wider">
            Đi trễ
          </p>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-300">
            {data.lateCount}
          </p>
        </div>

        {/* Absent Count */}
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
          <p className="text-red-600 dark:text-red-400 text-xs font-semibold mb-1 uppercase tracking-wider">
            Vắng mặt
          </p>
          <p className="text-2xl font-black text-red-700 dark:text-red-300">
            {data.absentCount}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Sĩ số: {data.totalStudents} học sinh</span>
          <span>
            Có mặt buổi gần nhất: {data.lastSessionAttendance}/
            {data.totalStudents}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
