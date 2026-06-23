import { Video, MapPin, Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/src/shared/components/ui/card"
import { Button } from "@/src/shared/components/ui/button"
import { ScheduleRuleDto } from "@/src/features/booking/bookingApi"

interface ClassInfoProps {
  mode: "ONLINE" | "AT_HOME"
  scheduleRules: ScheduleRuleDto[]
  meetLink?: string
}

export function OnlineClassInfo({
  mode,
  scheduleRules,
  meetLink,
}: ClassInfoProps) {
  const isOnline = mode === "ONLINE"
  const dayMap: Record<number, string> = { 0: "Chủ nhật", 1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7" }

  return (
    <Card className="border-border shadow-sm rounded-2xl overflow-hidden bg-card hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
          <div className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isOnline ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-600'}`}>
            {isOnline ? (
              <Video className="size-6" strokeWidth={2.5} />
            ) : (
              <MapPin className="size-6" strokeWidth={2.5} />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-foreground leading-tight">
              {isOnline ? "Lớp học trực tuyến" : "Học tại nhà"}
            </h3>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {isOnline ? "Google Meet" : "Gia sư đến tận nơi"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {scheduleRules && scheduleRules.length > 0 ? (
              scheduleRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Calendar className="size-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground font-bold leading-tight">
                      {dayMap[rule.dayOfWeek] || `Thứ ${rule.dayOfWeek}`} hàng tuần
                    </span>
                    <span className="text-xs text-muted-foreground font-medium mt-0.5">
                      {rule.startTime} - {rule.endTime}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 text-muted-foreground">
                <Calendar className="size-5 mt-0.5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Chưa có lịch học</span>
              </div>
            )}
          </div>

          {isOnline && (
            <Button
              variant={meetLink ? "default" : "secondary"}
              className={`w-full gap-2 font-bold h-11 rounded-lg border text-sm transition-all active:scale-[0.96] ${meetLink ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-sm' : 'bg-secondary text-secondary-foreground border-border'}`}
              asChild
              disabled={!meetLink}
            >
              <a
                href={meetLink || "#"}
                target={meetLink ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={(e) => !meetLink && e.preventDefault()}
              >
                <ExternalLink className="size-4" strokeWidth={2.5} />
                {meetLink ? "Vào phòng học trực tuyến (Meet)" : "Phòng học đang được khởi tạo..."}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}