import { PlayCircle } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import Link from "next/link";

const COURSES = [
  { title: "Toán 12 - Luyện thi Đại học", tutor: "Thầy Minh", progress: 75, lessons: 25 },
  { title: "Tiếng Anh: IELTS 7.0+", tutor: "Cô Linh", progress: 40, lessons: 18 },
];

export const RecentCourses = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Tiếp tục học tập</h2>
        <Button variant="link" asChild className="text-info font-bold p-0">
          <Link href="/student/courses">Xem tất cả</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COURSES.map((course, i) => (
          <Card key={i} className="group border-none shadow-sm hover:shadow-xl transition-all overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="space-y-1">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-info transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">Gia sư: {course.tutor}</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <PlayCircle className="size-16 text-white fill-white/20" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="text-info">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-info rounded-full transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <Button asChild variant="secondary" className="w-full font-bold rounded-xl bg-muted hover:bg-info hover:text-info-foreground transition-all">
                  <Link href="/student/courses/1">Tiếp tục bài học</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
