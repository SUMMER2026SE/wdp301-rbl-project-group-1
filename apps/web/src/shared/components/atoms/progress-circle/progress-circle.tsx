import { Button } from "@/src/shared/components/ui/button"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/src/shared/components/ui/card"

interface ProgressCircleProps {
    progress: number
    completedLessons: number
    totalLessons: number
}

export function ProgressCircle({
    progress,
    completedLessons,
    totalLessons,
}: ProgressCircleProps) {
    const radius = 16
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <Card className="border-border shadow-sm rounded-xl overflow-hidden">
            <CardContent className="flex flex-col items-center p-6">
                <div className="relative mb-4 flex items-center justify-center">
                    <svg className="size-32 -rotate-90 transform" viewBox="0 0 40 40">
                        {/* Background circle */}
                        <circle
                            cx="20"
                            cy="20"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-border"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="20"
                            cy="20"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-primary transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-foreground">
                            {progress}%
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground">
                            Hoàn thành
                        </span>
                    </div>
                </div>

                <p className="mb-6 max-w-[240px] text-center text-sm font-medium leading-relaxed text-muted-foreground">
                    Bạn đã hoàn thành <span className="text-foreground font-black">{completedLessons}/{totalLessons}</span> bài học. Cố gắng lên nhé!
                </p>

                <Button className="h-11 w-full gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]">
                    <Play className="size-4 fill-current" />
                    Tiếp tục bài học
                </Button>
            </CardContent>
        </Card>
    )
}
