"use client";

import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import { Trophy } from "lucide-react";

export interface TopStudent {
  id: string;
  name: string;
  averageScore: number;
  rank: number;
}

interface TopScoresSectionProps {
  students: TopStudent[];
}

export function TopScoresSection({ students }: TopScoresSectionProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColors = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
      "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    ];
    return colors[index] || colors[0];
  };

  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Bảng điểm tổng hợp (Top 3)
        </h2>
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold p-0 h-auto"
        >
          Xem tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {students.map((student, index) => (
          <div
            key={student.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <Avatar
              className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${getAvatarColors(index)}`}
            >
              <AvatarFallback className={`${getAvatarColors(index)}`}>
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {student.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ĐTB:{" "}
                <span className="text-green-600 dark:text-green-400 font-bold">
                  {student.averageScore.toFixed(1)}
                </span>
              </p>
            </div>
            {index === 0 && (
              <Trophy className="size-5 text-amber-500" aria-label="Top 1" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
