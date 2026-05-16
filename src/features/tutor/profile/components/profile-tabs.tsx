import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/src/shared/components/ui/tabs";
import { Card } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";

import {
    CheckCircle2,
    BookOpen,
    GraduationCap,
    Lightbulb,
    Award,
    Verified,
    Calendar,
} from "lucide-react";

export function ProfileTabs() {
    return (
        <Tabs defaultValue="teaching" className="w-full">
            <div className="bg-muted/30 rounded-t-2xl border border-border/60 backdrop-blur-sm overflow-hidden">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                    <TabsTrigger
                        value="teaching"
                        className="rounded-xl py-3 data-active:bg-background data-active:text-primary data-active:shadow-md transition-all font-bold text-sm"
                    >
                        Thông tin giảng dạy
                    </TabsTrigger>
                    <TabsTrigger
                        value="certificates"
                        className="rounded-xl py-3 data-active:bg-background data-active:text-primary data-active:shadow-sm transition-all font-bold text-sm"
                    >
                        Bằng cấp & Chứng chỉ
                    </TabsTrigger>
                </TabsList>
            </div>

            {/* Tab 1: Teaching Info */}
            <TabsContent
                value="teaching"
                className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none focus-visible:ring-0"
            >
                <Card className="p-8 bg-card border-x border-b border-border/60 shadow-sm rounded-t-none rounded-b-2xl">
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <BookOpen className="size-5" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Kinh nghiệm dạy học
                                </h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                12 năm kinh nghiệm dạy tiếng Anh cho học sinh từ lớp 6 đến 12 và
                                người đi làm.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-lg bg-success-soft text-success">
                                    <GraduationCap className="size-5" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Chuyên môn
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    "Speaking",
                                    "Listening",
                                    "Writing",
                                    "Grammar",
                                    "Vocabulary",
                                    "IELTS Preparation",
                                ].map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="px-4 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors cursor-default text-sm font-medium"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="p-2 rounded-lg bg-info-soft text-info">
                                    <Lightbulb className="size-5" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">
                                    Phương pháp dạy
                                </h3>
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="size-4 text-success mt-0.5" />
                                    <span>
                                        Dạy theo phương pháp Communicative Language Teaching
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="size-4 text-success mt-0.5" />
                                    <span>Sử dụng công nghệ và ứng dụng hiện đại</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="size-4 text-success mt-0.5" />
                                    <span>Tập trung vào kỹ năng thực tiễn và giao tiếp</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="size-4 text-success mt-0.5" />
                                    <span>Tạo môi trường học tập vui vẻ và hiệu quả</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </TabsContent>

            {/* Tab 2: Certificates */}
            <TabsContent
                value="certificates"
                className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none focus-visible:ring-0"
            >
                <Card className="p-8 bg-card border-x border-b border-border/60 shadow-sm rounded-t-none rounded-b-2xl">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 rounded-lg bg-purple-soft text-purple">
                                <Award className="size-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                Chứng chỉ & Bằng cấp
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    title: "IELTS Certificate",
                                    info: "Band 8.0",
                                    date: "15/06/2021",
                                    verified: true,
                                },
                                {
                                    title: "Bằng Cấp Đại Học",
                                    info: "Sư phạm Tiếng Anh",
                                    date: "ĐH Sư phạm Tp.HCM",
                                    verified: true,
                                },
                                {
                                    title: "TESOL Certification",
                                    info: "120-hour course",
                                    date: "20/03/2019",
                                    verified: true,
                                },
                            ].map((cert, index) => (
                                <div
                                    key={index}
                                    className="p-5 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all group relative overflow-hidden"
                                >

                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                {cert.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground font-medium">
                                                {cert.info}
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 mt-2 flex items-center gap-1">
                                                <Calendar className="size-3" />
                                                {cert.date}
                                            </p>
                                        </div>
                                        {cert.verified && (
                                            <Badge className="bg-success-soft/50 text-success border-success/20 flex items-center gap-1 px-2 py-0.5 shadow-none">
                                                <Verified className="size-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                                    Verified
                                                </span>
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
