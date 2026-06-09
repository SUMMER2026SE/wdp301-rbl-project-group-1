import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { MapPin, Video, CreditCard } from "lucide-react";
import { BookingResponseDto } from "@/src/features/booking/bookingApi";

interface CourseHeaderProps {
  booking: BookingResponseDto;
}

const statusConfig: Record<
  string,
  { label: string; bgColor: string; textColor: string; dotColor: string }
> = {
  PENDING: {
    label: "Đang chờ duyệt",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-700 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Đã hoàn thành",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  CANCELLED: {
    label: "Đã hủy",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    textColor: "text-rose-700 dark:text-rose-400",
    dotColor: "bg-rose-500",
  },
};

export function CourseHeader({ booking }: CourseHeaderProps) {
  const config = statusConfig[booking.status] || statusConfig["PENDING"];
  const isOnline = booking.mode === "ONLINE";

  return (
    <div className="bg-card border border-border shadow-sm rounded-[2rem] p-6 md:p-8 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit ${config.bgColor} ${config.textColor}`}
            >
              <span className={`size-1.5 rounded-full ${config.dotColor}`} />
              {config.label}
            </div>
          </div>
          <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight tracking-tight mt-2">
            {booking.subject?.name || "Lớp học gia sư"}
          </h1>
        </div>
        
        <div className="flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-3">
            <Avatar
              src={booking.tutor.avatarUrl || ""}
              alt={booking.tutor.name}
              fallback={booking.tutor.name}
              className="size-12 border-2 border-background shadow-sm ring-2 ring-primary/10"
            />
            <div>
              <span className="text-muted-foreground block text-xs font-medium tracking-wider uppercase">
                Gia sư
              </span>
              <span className="text-foreground font-black text-base">
                {booking.tutor.name}
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-border/60" />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-foreground font-bold">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                {isOnline ? (
                  <Video className="size-4 text-primary" />
                ) : (
                  <MapPin className="size-4 text-primary" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Hình thức</span>
                <span>{isOnline ? "Trực tuyến" : "Tại nhà"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-foreground font-bold">
              <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CreditCard className="size-4 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Học phí</span>
                <span className="text-emerald-600">
                  {booking.price ? `${booking.price.toLocaleString("vi-VN")} đ` : "Miễn phí"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
