"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/ui/avatar";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { CalendarDays, MapPin, Wallet, Users, BookOpen } from "lucide-react";
import { ExtendedTutorRequest } from "./tutor-request-list";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TutorRequestCardProps {
  request: ExtendedTutorRequest;
  onApply?: (id: string) => void;
}

const formatDay = (day: number) => (day === 0 ? "CN" : `T${day + 1}`);

export function TutorRequestCard({ request, onApply }: TutorRequestCardProps) {
  const isOpen = request.status === "OPEN";
  const studentName = request.student?.nickname || "Học viên ẩn danh";
  const studentAvatar = request.student?.avatarUrl || "";
  const createdAtFormatted = format(new Date(request.createdAt), "dd/MM/yyyy", { locale: vi });
  
  const scheduleText = request.scheduleRules && request.scheduleRules.length > 0
    ? request.scheduleRules.map((r) => `${formatDay(r.dayOfWeek)} (${r.startTime}-${r.endTime})`).join(", ")
    : "Chưa có lịch cụ thể";

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Avatar Area */}
        <div className="flex-shrink-0">
          <Avatar className="h-14 w-14 border border-border shadow-sm ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
            <AvatarImage src={studentAvatar} alt={studentName} />
            <AvatarFallback className="bg-primary/5 text-primary font-semibold text-lg uppercase">
              {studentName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          
          {/* Header (Title + Badge) */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {request.title}
              </h3>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <span className="text-foreground">{studentName}</span>
                <span className="opacity-50">•</span>
                <span>{createdAtFormatted}</span>
              </p>
            </div>
            
            <Badge 
              variant="secondary" 
              className={`whitespace-nowrap px-3 py-1 font-semibold rounded-full ${
                isOpen 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isOpen ? "Đang mở" : "Đã đóng"}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-base text-muted-foreground leading-relaxed line-clamp-2 pr-4">
            {request.description}
          </p>

          {/* Details & Actions */}
          <div className="pt-2 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-muted-foreground">
              {/* Subject */}
              {request.subject?.name && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
                    <BookOpen className="size-4" />
                  </div>
                  <span>{request.subject.name}</span>
                </div>
              )}

              {/* Budget */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                  <Wallet className="size-4" />
                </div>
                <span>{request.budget ? `${request.budget.toLocaleString("vi-VN")} VND / buổi` : "Thỏa thuận"}</span>
              </div>
              
              {/* Schedule */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                  <CalendarDays className="size-4" />
                </div>
                <span className="truncate max-w-[250px]" title={scheduleText}>{scheduleText}</span>
              </div>
              
              {/* Mode */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                  <MapPin className="size-4" />
                </div>
                <span className="truncate max-w-[200px]">{request.mode === "ONLINE" ? "Học trực tuyến" : "Học tại nhà"}</span>
              </div>

              {/* Bids Count */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Users className="size-4" />
                </div>
                <span>{request.bidCount || 0} lượt báo giá</span>
              </div>
            </div>

            <Button 
              onClick={() => onApply?.(request.id)}
              disabled={!isOpen}
              className={`h-11 px-8 rounded-xl font-bold transition-all shadow-sm ${
                isOpen 
                  ? "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-md" 
                  : ""
              }`}
            >
              Ứng tuyển ngay
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
