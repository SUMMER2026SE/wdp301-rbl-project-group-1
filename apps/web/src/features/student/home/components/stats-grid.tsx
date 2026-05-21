import { BookOpen, Clock, Trophy, Star } from "lucide-react";
import { Card, CardContent } from "@/src/shared/components/ui/card";

const STATS = [
  { label: "Đang học", value: "4", icon: BookOpen, color: "text-info", bg: "bg-info-soft" },
  { label: "Hoàn thành", value: "12", icon: Trophy, color: "text-warning", bg: "bg-warning-soft" },
  { label: "Điểm TB", value: "8.5", icon: Star, color: "text-success", bg: "bg-success-soft" },
  { label: "Giờ học", value: "48h", icon: Clock, color: "text-primary", bg: "bg-primary/10" },
];

export const StatsGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STATS.map((stat, i) => (
        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <div className={`size-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="size-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
