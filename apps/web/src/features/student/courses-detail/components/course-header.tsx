import { BookOpen, Play } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/shared/components/ui/avatar"

interface CourseHeaderProps {
    course: {
        title: string
        tutorName: string
        tutorAvatar: string
        chapters: unknown[]
        totalLessons: number
    }
}

export function CourseHeader({ course }: CourseHeaderProps) {
    return (
        <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-6">
                <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight tracking-tight">
                    {course.title}
                </h1>
                <div className="flex items-center gap-6 text-sm flex-wrap">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-12 border-2 border-background shadow-sm ring-2 ring-primary/10">
                            <AvatarImage src={course.tutorAvatar} alt={course.tutorName} />
                            <AvatarFallback>{course.tutorName?.[0] || 'T'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="text-muted-foreground block text-xs font-medium tracking-wider">
                                Gia sư
                            </span>
                            <span className="text-foreground font-black text-base">
                                {course.tutorName}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:block h-10 w-px bg-border/60" />

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2.5 text-foreground font-bold">
                            <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                                <BookOpen className="size-3 text-white" />
                            </div>
                            <span>{course.chapters.length} Chương</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-foreground font-bold">
                            <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                                <Play className="size-3 text-white fill-white" />
                            </div>
                            <span>{course.totalLessons} Bài học</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}