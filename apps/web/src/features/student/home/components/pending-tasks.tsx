import { BookOpen } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";

const TASKS = [
  { title: "Bài tập: Đạo hàm hàm số mũ", deadline: "Hôm nay", type: "Quiz" },
  { title: "IELTS Writing Task 2", deadline: "Ngày mai", type: "Essay" },
  { title: "Ngữ pháp: Câu điều kiện", deadline: "2 ngày tới", type: "Practice" },
];

export const PendingTasks = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black tracking-tight text-foreground">Bài tập cần làm</h2>
      <div className="space-y-3">
        {TASKS.map((task, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:border-info/30 transition-colors">
            <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
              <BookOpen className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-foreground text-sm truncate">{task.title}</h5>
              <p className="text-xs font-medium text-muted-foreground">Hạn chót: {task.deadline}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-muted text-[10px] font-bold text-muted-foreground uppercase">
              {task.type}
            </span>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full border-border text-muted-foreground font-bold rounded-xl h-11">
        Xem tất cả bài tập
      </Button>
    </div>
  );
};
