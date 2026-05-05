import { Video, Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/src/shared/components/ui/card"
import { Button } from "@/src/shared/components/ui/button"

interface OnlineClassInfoProps {
    platform: string
    schedule: string
    meetLink?: string
}

const dayMap: Record<string, string> = {
    Mon: "Thứ 2",
    Tue: "Thứ 3",
    Wed: "Thứ 4",
    Thu: "Thứ 5",
    Fri: "Thứ 6",
    Sat: "Thứ 7",
    Sun: "Chủ nhật",
}

export function OnlineClassInfo({
    platform,
    schedule,
    meetLink,
}: OnlineClassInfoProps) {

    // Format: "Tue, Thu (19:30-21:00)"
    const scheduleParts = schedule.match(/^(.+?)\s*\(([^)]+)\)$/)

    let displayDate = schedule
    let displayTime = ""

    if (scheduleParts) {
        const days = scheduleParts[1]
            .split(",")
            .map(d => dayMap[d.trim()] || d.trim())
            .join(", ")

        displayDate = `${days} hàng tuần`
        displayTime = scheduleParts[2].replace("-", " - ")
    }

    return (
        <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden bg-background">
            <CardContent className="p-6">

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    <div className="size-12 rounded-lg bg-live-soft flex items-center justify-center flex-shrink-0">
                        <Video className="size-6 text-live" strokeWidth={2.5} />
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-base font-bold text-foreground leading-tight">
                            Lớp học trực tuyến
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                            {platform}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    <div className="flex items-start gap-3">
                        <Calendar className="size-5 text-muted-foreground mt-0.5" strokeWidth={1.5} />

                        <div className="flex flex-col">
                            <span className="text-sm text-foreground font-bold leading-tight">
                                {displayDate}
                            </span>

                            {displayTime && (
                                <span className="text-xs text-muted-foreground font-medium">
                                    {displayTime}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        className="w-full gap-2 font-bold h-11 rounded-lg bg-secondary text-secondary-foreground border-border border text-sm transition-all active:scale-[0.96]"
                        asChild
                    >
                        <a
                            href={meetLink || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="size-4" strokeWidth={2.5} />
                            Vào lớp Meet
                        </a>
                    </Button>

                </div>
            </CardContent>
        </Card>
    )
}