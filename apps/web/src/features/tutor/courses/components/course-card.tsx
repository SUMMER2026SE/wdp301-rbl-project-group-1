import { Button } from "@/src/shared/components/ui/button";
import { CalendarClock, User, Video, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookingResponseDto } from "@/src/features/booking/bookingApi";

interface CourseCardProps {
  booking: BookingResponseDto;
}

export function CourseCard({ booking }: CourseCardProps) {
  return (
    <Link href={`/tutor/courses/${booking.id}`}>
      <div className="flex flex-col rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all cursor-pointer h-full">
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col gap-5">
          {/* Header with subject badge and menu */}
          <div className="flex justify-between items-start">
             <div className="flex flex-col gap-2 w-full">
               <div className="flex justify-between items-center w-full">
                 <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md ${
                    booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    booking.status === "PENDING" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    booking.status === "COMPLETED" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                 }`}>
                   {booking.status}
                 </span>
                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                   {booking.mode === "ONLINE" ? "Online" : "Tại nhà"}
                 </span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mt-2 tracking-tight">
                 {booking.subject?.name || "Lớp gia sư cá nhân"}
               </h3>
             </div>
          </div>

          <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                {booking.student.avatarUrl ? (
                  <Image src={booking.student.avatarUrl} alt={booking.student.nickname || "Học viên"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Học viên</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white">{booking.student.nickname || "Học viên ẩn danh"}</span>
              </div>
          </div>

          {/* Course details */}
          <div className="space-y-3 mt-1 flex-1">
            {/* Schedule */}
            <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
              <CalendarClock className="size-4 text-slate-400 shrink-0" />
              <span>
                {booking.scheduleRules.length > 0
                  ? `${booking.scheduleRules.length} buổi / tuần`
                  : "Lịch tự do"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
              <CreditCard className="size-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-900 dark:text-white">
                {booking.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.price) : "Thỏa thuận"}
              </span>
            </div>

            {/* Meet link (placeholder for now) */}
            {booking.mode === "ONLINE" && booking.status === "CONFIRMED" && (
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <Video className="size-4 text-slate-400 shrink-0" />
                <span className="text-slate-400 italic">Liên kết Meet sẽ hiển thị khi đến giờ</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer button */}
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800/50">
          <Button
            variant="outline"
            className="w-full py-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-sm active:scale-[0.98]"
          >
            Quản lý lớp học
          </Button>
        </div>
      </div>
    </Link>
  );
}
