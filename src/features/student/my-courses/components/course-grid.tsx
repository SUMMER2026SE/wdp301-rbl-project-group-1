import { User, CalendarClock, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { BookingFilterStatus } from "./filter-tabs";
import { useGetBookingsQuery } from "@/src/features/booking/bookingApi";

interface CourseGridProps {
  filter: BookingFilterStatus;
}

export default function CourseGrid({ filter }: CourseGridProps) {
  const { data, isLoading, error } = useGetBookingsQuery({
    limit: 20,
    page: 1,
    status: filter === "ALL" ? undefined : filter,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-24 text-slate-500 font-medium">Đang tải danh sách lớp học...</div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center py-24 text-rose-500 font-medium">Có lỗi xảy ra khi tải dữ liệu.</div>;
  }

  const bookings = data?.data || [];

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Bạn chưa có lớp học nào ở trạng thái này.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
        >
          {/* Header section with status */}
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/50">
             <div className="flex justify-between items-start mb-4">
               <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
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
             <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-900 dark:text-white tracking-tight">
                {booking.subject?.name || "Lớp gia sư cá nhân"}
             </h3>
          </div>

          <div className="flex flex-1 flex-col p-6 gap-5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                {booking.tutor.avatarUrl ? (
                  <Image src={booking.tutor.avatarUrl} alt={booking.tutor.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="size-5" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Gia sư</span>
                 <span className="text-sm font-bold text-slate-900 dark:text-white">{booking.tutor.name}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <CalendarClock className="size-4 shrink-0 text-slate-400" />
                <span className="truncate">
                  {booking.scheduleRules.length > 0
                    ? `${booking.scheduleRules.length} buổi / tuần`
                    : "Lịch tự do"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                <CreditCard className="size-4 shrink-0 text-slate-400" />
                <span className="truncate font-medium text-slate-900 dark:text-white">
                  {booking.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.price) : "Đang cập nhật"}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Link href={`/student/my-courses/${booking.id}`}>
                <Button className="w-full py-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm active:scale-[0.98]">
                  {booking.status === "CONFIRMED" ? "Vào lớp ngay" : "Xem chi tiết"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
