import { Clock } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";

export const UpcomingSession = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black tracking-tight text-foreground">Buổi học sắp tới</h2>
      <Card className="border-none bg-info-soft/50 shadow-sm overflow-hidden rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="size-14 rounded-2xl bg-card shadow-sm flex flex-col items-center justify-center shrink-0">
              <span className="text-xs font-bold text-muted-foreground uppercase">T.10</span>
              <span className="text-xl font-black text-info leading-none">15</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-foreground leading-tight">Toán 12: Khảo sát hàm số</h4>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-4" />
                19:30 - 21:00
              </p>
            </div>
          </div>
          <Button className="w-full bg-info hover:bg-info/90 text-info-foreground font-bold h-11 rounded-xl shadow-md shadow-info/20">
            Vào lớp học
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
