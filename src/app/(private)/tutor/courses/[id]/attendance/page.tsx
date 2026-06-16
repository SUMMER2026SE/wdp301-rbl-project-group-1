"use client";

import { useMemo, useState } from "react";
import { format, isPast } from "date-fns";
import { vi } from "date-fns/locale";
import { useParams } from "next/navigation";
import {
  useGetMySessionsQuery,
  useTakeAttendanceMutation,
  TakeAttendanceDto,
} from "@/src/features/booking/bookingApi";
import { Button } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import { Textarea } from "@/src/shared/components/ui/textarea";
import {
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Save,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  PRESENT: {
    label: "Có mặt",
    icon: <CheckCircle2 className="size-4" />,
    color: "text-success",
    bg: "bg-success/10 border-success/30 hover:bg-success/20",
  },
  LATE: {
    label: "Muộn",
    icon: <Clock className="size-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/10 dark:border-amber-700 dark:hover:bg-amber-900/20",
  },
  EXCUSED: {
    label: "Có phép",
    icon: <ShieldCheck className="size-4" />,
    color: "text-primary",
    bg: "bg-primary/5 border-primary/20 hover:bg-primary/10",
  },
  ABSENT: {
    label: "Vắng",
    icon: <Ban className="size-4" />,
    color: "text-destructive",
    bg: "bg-destructive/5 border-destructive/20 hover:bg-destructive/10",
  },
};

function StatusButton({
  status,
  selected,
  onClick,
}: {
  status: AttendanceStatus;
  selected: boolean;
  onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all duration-150 active:scale-[0.97]",
        cfg.bg,
        cfg.color,
        selected
          ? "ring-2 ring-offset-1 ring-current opacity-100"
          : "opacity-60"
      )}
    >
      {cfg.icon}
      {cfg.label}
    </button>
  );
}

export default function AttendancePage() {
  const params = useParams();
  const bookingId = params.id as string;

  const { data: sessionsResponse, isLoading } = useGetMySessionsQuery({});
  const [takeAttendance, { isLoading: isSaving }] = useTakeAttendanceMutation();

  // Local state: sessionId => { status, notes }
  const [draft, setDraft] = useState<
    Record<string, { status: AttendanceStatus; notes: string }>
  >({});
  const [savedSessions, setSavedSessions] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const sessions = useMemo(() => {
    return (
      sessionsResponse?.data
        ?.filter((s) => s.bookingId === bookingId)
        .sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        ) || []
    );
  }, [sessionsResponse?.data, bookingId]);

  // Only past+today sessions can have attendance taken
  const eligibleSessions = sessions.filter(
    (s) =>
      s.status !== "CANCELLED" &&
      (s.status === "COMPLETED" || isPast(new Date(s.endTime)))
  );

  const getDraft = (sessionId: string) =>
    draft[sessionId] ?? { status: "PRESENT" as AttendanceStatus, notes: "" };

  const setStatus = (sessionId: string, status: AttendanceStatus) => {
    setDraft((prev) => ({
      ...prev,
      [sessionId]: { ...getDraft(sessionId), status },
    }));
  };

  const setNotes = (sessionId: string, notes: string) => {
    setDraft((prev) => ({
      ...prev,
      [sessionId]: { ...getDraft(sessionId), notes },
    }));
  };

  const handleSave = async (sessionId: string) => {
    const data = getDraft(sessionId);
    const payload: TakeAttendanceDto = {
      status: data.status,
      notes: data.notes || undefined,
    };
    try {
      setSavingId(sessionId);
      await takeAttendance({
        sessionId,
        bookingId,
        takeAttendanceDto: payload,
      }).unwrap();
      setSavedSessions((prev) => new Set(prev).add(sessionId));
      setExpandedId(null);
    } finally {
      setSavingId(null);
    }
  };

  // Stats across all eligible sessions
  const stats = useMemo(() => {
    const counts: Record<AttendanceStatus, number> = {
      PRESENT: 0,
      LATE: 0,
      EXCUSED: 0,
      ABSENT: 0,
    };
    savedSessions.forEach((id) => {
      const s = draft[id]?.status ?? "PRESENT";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [savedSessions, draft]);

  if (isLoading) {
    return (
      <div className="flex h-[30vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats strip */}
      {eligibleSessions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              ["PRESENT", "Có mặt", "text-success"],
              ["LATE", "Muộn", "text-amber-600 dark:text-amber-400"],
              ["EXCUSED", "Có phép", "text-primary"],
              ["ABSENT", "Vắng", "text-destructive"],
            ] as const
          ).map(([key, label, color]) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", color)}>
                  {STATUS_CONFIG[key].icon}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              <span className={cn("text-xl font-bold tabular-nums", color)}>
                {stats[key]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Sessions */}
      {eligibleSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-muted/20">
          <Calendar className="size-8 text-muted-foreground mb-3 opacity-40" />
          <p className="text-sm font-medium text-muted-foreground">
            Chưa có buổi học nào kết thúc để điểm danh.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1 text-center max-w-[260px]">
            Điểm danh sẽ khả dụng sau khi buổi học kết thúc.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-base">
              Điểm danh theo buổi
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({savedSessions.size}/{eligibleSessions.length} đã lưu)
              </span>
            </h3>
          </div>

          {eligibleSessions.map((session, index) => {
            const start = new Date(session.startTime);
            const end = new Date(session.endTime);
            const isExpanded = expandedId === session.id;
            const isSaved = savedSessions.has(session.id);
            const currentDraft = getDraft(session.id);
            const isThisSaving = savingId === session.id;

            return (
              <div
                key={session.id}
                className={cn(
                  "border rounded-xl overflow-hidden transition-all duration-200",
                  isSaved
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-card"
                )}
              >
                {/* Row header — always visible */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : session.id)
                  }
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        isSaved
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {eligibleSessions.length - index}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-foreground">
                        {format(start, "EEEE, dd/MM/yyyy", { locale: vi })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(start, "HH:mm")} – {format(end, "HH:mm")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isSaved ? (
                      <Badge variant="success" className="text-[10px]">
                        {STATUS_CONFIG[currentDraft.status].label}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Chưa điểm danh
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded section */}
                {isExpanded && (
                  <div className="px-4 pb-4 flex flex-col gap-4 border-t border-border/50">
                    {/* Status selector */}
                    <div className="flex flex-col gap-2 pt-3">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Trạng thái điểm danh
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(
                          ["PRESENT", "LATE", "EXCUSED", "ABSENT"] as const
                        ).map((s) => (
                          <StatusButton
                            key={s}
                            status={s}
                            selected={currentDraft.status === s}
                            onClick={() => setStatus(session.id, s)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Ghi chú (không bắt buộc)
                      </label>
                      <Textarea
                        value={currentDraft.notes}
                        onChange={(e) => setNotes(session.id, e.target.value)}
                        placeholder="Nhận xét về buổi học, tình hình học sinh..."
                        className="resize-none h-20 text-sm rounded-xl"
                      />
                    </div>

                    <Button
                      onClick={() => handleSave(session.id)}
                      disabled={isThisSaving || isSaving}
                      size="sm"
                      className="self-end gap-2"
                    >
                      {isThisSaving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4" />
                      )}
                      {isSaved ? "Cập nhật" : "Lưu điểm danh"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
