"use client";

import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { TutorRequestCard } from "./tutor-request-card";
import { Frown } from "lucide-react";
import { TutorRequestResponseDto } from "@/src/features/tutor-request/tutorRequestApi";

export interface ExtendedTutorRequest extends TutorRequestResponseDto {
  student?: { nickname: string | null; avatarUrl: string | null };
  subject?: { name: string; slug: string };
  bidCount?: number;
  scheduleRules?: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

interface TutorRequestListProps {
  requests: ExtendedTutorRequest[];
  isLoading?: boolean;
  onApply?: (id: string) => void;
}

export function TutorRequestList({ requests, isLoading, onApply }: TutorRequestListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border p-6 shadow-sm bg-card">
            <div className="flex gap-5">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center border border-border border-dashed rounded-2xl bg-card/50">
        <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
          <Frown className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Không tìm thấy yêu cầu nào</h3>
        <p className="text-muted-foreground max-w-md">
          Hiện tại không có yêu cầu tìm gia sư nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh lại các tiêu chí tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      {requests.map((request) => (
        <TutorRequestCard key={request.id} request={request} onApply={onApply} />
      ))}
    </div>
  );
}
