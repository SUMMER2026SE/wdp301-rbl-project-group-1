import { Button } from '@/src/shared/components/ui/button';

export function NextClassWidget() {
    return (
        <section>
            <div className="flex flex-col md:flex-row items-stretch overflow-hidden rounded-xl shadow-md bg-card border border-border transition-all hover:shadow-lg">
                <div
                    className="w-full md:w-1/3 bg-center bg-no-repeat bg-cover min-h-[200px]"
                    style={{
                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrRUgj_LwFEAAqYHAI-hIs7NF-sPwP3oYpqJ4rG30HvXuzFz_oBswZqeAdwqN6EikRFqRxA01K_AWa-2IDAa0JQ-TGEWg0GGYaG1NnQgFNnNOWOcf7FyM6Npnik0jzZl5mxJdy6dm4q5Sqy-f3hpcDwSxH7522H0F3QXVp0uRaJjf4j37Zk5IZ2VJ7ZgfrfkGUJfhetZmIXqdKbFJ7CxxBsBYQScI1uBIew_UvntN5T2MzsvVp2AVu4rhK4RQtHTY6_kA58UaM35w")`,
                    }}
                >
                    <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end md:hidden">
                        <span className="text-white text-xs font-bold uppercase tracking-wider bg-primary px-2 py-1 rounded w-fit mb-2">
                            Đang diễn ra
                        </span>
                    </div>
                </div>

                <div className="flex w-full md:w-2/3 flex-col justify-between p-6 gap-4">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                                Buổi học tiếp theo
                            </p>
                            <span className="hidden md:inline-block text-xs font-bold uppercase tracking-wider text-white bg-primary px-3 py-1 rounded-full">
                                Sắp diễn ra
                            </span>
                        </div>
                        <h2 className="text-foreground text-2xl font-bold leading-tight mb-2">
                            Toán Lớp 10 - Em Bảo
                        </h2>
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-muted-foreground/80">
                                <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                                <span className="text-base font-medium">14:00 - 15:30 hôm nay</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground/80">
                                <span className="material-symbols-outlined text-primary text-xl">topic</span>
                                <span className="text-base font-medium">Chủ đề: Đại số tuyến tính & Bài tập về nhà</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <Button className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-md shadow-primary/20">
                            <span className="material-symbols-outlined group-hover:animate-pulse">videocam</span>
                            <span>Vào lớp ngay (Google Meet)</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}