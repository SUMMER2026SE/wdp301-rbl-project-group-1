import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/src/shared/components/ui/button";
import { Progress } from "@/src/shared/components/ui/progress";

export interface CourseCard {
  id: string;
  title: string;
  teacher: string;
  image: string;
  progress: number;
  progressColor: string;
}

const courses: CourseCard[] = [
  {
    id: "1",
    title: "Toán Hình không gian 12 - Luyện thi Đại học",
    teacher: "Thầy Nguyễn Văn A",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gVGhgQwKn1B6gMrt4I-rZblwIOcySIqSHyI9PKK53_f0-s4cjdAchJZM3jDohQQ8RPlgh9QyVzf7Y5JCKM62R-S1vZjBSautar9pKYxCEgWblR_Orgt6yMV81f-tkIWQdGsavZPbsJLIRxnUBMtgoDlL-5xQ1HFuSukFxV1R-ZJTLUPZrCLT3puCsSsuXiSnGZd6U6jvEj4y8g1q3Aat3sthuuX8RCUBgpVGYNhtTPStDmeAyH4V8L5MvAv9KQsGktNJuBHQmAI",
    progress: 75,
    progressColor: "bg-info",
  },
  {
    id: "2",
    title: "IELTS Speaking 6.5+ Intensive",
    teacher: "Ms. Sarah",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDii-0kOuft-lKLtZMT0ZexL59LRYAWDuRafbrderDxjWVnb89VscfDsUA1VCicF6CiTae1bNTv62-6ejHWC5hRDabHyvif5zr1LNHKeAWr3AH-vd4RvIjMBMWLyma36yV8GTsajONn5U5NtHkUjE7YpUly3eLnASOx_plViIe9U1sig0oM8LLNHXzfPSQQ8M9mAq_U5YfGYSX6m40s9y2jlYhWu-K6Siai6M1DBZBt6QHaGIH0r2cNzWsj4gA-Bmzp83ZoGo0Enk",
    progress: 40,
    progressColor: "bg-primary",
  },
  {
    id: "3",
    title: "Hóa học Hữu cơ 12 Cơ bản & Nâng cao",
    teacher: "Cô Phạm Thu Thủy",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWHd2RFaGzulEOtvqForbWHMagI-qys7WlFWocLN5NGp7XVmM_EA02KELoyComi5nR-UDjGCXnpFbCmtbHtyn9azpJY4QKm9orAoOS2SDVlbK8rzifQawyezTPnGqF0boDtUk4nY_9hDZD70Dm94vhw4uVlzkxcoS5YYZCGEo3686Rk1myoYPMij2hJ6J_-0RmNWgwmkK0Rh_IQYhiXH3G0nIJJl3ib6tQYv3LH0YPb-bEjNOw8FdTGIquKP0UPMzIIEJ_sRFFUHI",
    progress: 15,
    progressColor: "bg-warning",
  },
  {
    id: "4",
    title: "Ngữ Văn 12 - Ôn thi THPT Quốc gia",
    teacher: "Cô Lê Mai",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDii-0kOuft-lKLtZMT0ZexL59LRYAWDuRafbrderDxjWVnb89VscfDsUA1VCicF6CiTae1bNTv62-6ejHWC5hRDabHyvif5zr1LNHKeAWr3AH-vd4RvIjMBMWLyma36yV8GTsajONn5U5NtHkUjE7YpUly3eLnASOx_plViIe9U1sig0oM8LLNHXzfPSQQ8M9mAq_U5YfGYSX6m40s9y2jlYhWu-K6Siai6M1DBZBt6QHaGIH0r2cNzWsj4gA-Bmzp83ZoGo0Enk",
    progress: 90,
    progressColor: "bg-success",
  },
];

interface CourseGridProps {
  filter: "studying" | "completed";
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Tiến độ</span>
        <span className="font-bold text-primary">{progress}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2 bg-muted"
        // We'll use a CSS variable or direct style to override indicator color if needed,
        // but usually primary is fine.
      />
    </div>
  );
}

export default function CourseGrid({ filter }: CourseGridProps) {
  const filteredCourses = filter === "studying" ? courses : [];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredCourses.map((course) => (
        <Link
          key={course.id}
          href={`/student/my-courses/${course.id}`}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-foreground">
              {course.title}
            </h3>

            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground/60" />
                <span className="text-sm font-medium text-muted-foreground">
                  {course.teacher}
                </span>
              </div>

              <ProgressBar progress={course.progress} />
            </div>

            <Button className="mt-6 w-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground">
              Vào học
            </Button>
          </div>
        </Link>
      ))}
    </div>
  );
}
