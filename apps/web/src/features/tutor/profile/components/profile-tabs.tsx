import { Badge } from "@/src/shared/components/ui/badge";
import { Card } from "@/src/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/shared/components/ui/tabs";

import { Award, BookOpen, GraduationCap, Lightbulb } from "lucide-react";

interface ProfileTabsProps {
  bio?: string | null;
  experience?: number | null;
  specialization?: string | null;
  education?: string | null;
}

export function ProfileTabs({
  bio = null,
  experience = null,
  specialization = null,
  education = null,
}: ProfileTabsProps) {
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
                {experience !== null
                  ? `${experience} năm kinh nghiệm giảng dạy`
                  : "Chưa cập nhật thông tin kinh nghiệm"}
              </p>
            </div>

            {specialization && (
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
                  <Badge
                    variant="secondary"
                    className="px-4 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors cursor-default text-sm font-medium"
                  >
                    {specialization}
                  </Badge>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-lg bg-info-soft text-info">
                  <Lightbulb className="size-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Giới thiệu bản thân
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {bio ?? "Chưa cập nhật thông tin giới thiệu"}
              </p>
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
                Bằng cấp & Chứng chỉ
              </h3>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {education ?? "Chưa cập nhật thông tin bằng cấp và chứng chỉ"}
            </p>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
