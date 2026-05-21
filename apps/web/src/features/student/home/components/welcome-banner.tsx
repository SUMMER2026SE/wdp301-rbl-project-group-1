import { ArrowRight } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import Link from "next/link";

export const WelcomeBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-info to-primary p-8 md:p-12 text-white">
      <div className="relative z-10 max-w-2xl space-y-4">
        <h1 className="text-3xl font-black md:text-5xl tracking-tight">
          Chào Minh Hoàng, 👋
        </h1>
        <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg">
          Hôm nay bạn có 2 buổi học sắp tới. Đừng quên hoàn thành bài tập về nhà nhé!
        </p>
        <div className="pt-4">
          <Button asChild className="bg-white text-info hover:bg-info-soft font-bold px-8 h-12 rounded-xl transition-all active:scale-[0.98]">
            <Link href="/student/schedule">
              Xem lịch học
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 mr-20 mb-10 size-40 rounded-full bg-info/20 blur-2xl" />
    </section>
  );
};
