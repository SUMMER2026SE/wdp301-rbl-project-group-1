import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Card } from "@/src/shared/components/ui/card";
import { Award, Calendar, Clock, MapPin, Medal, Star } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

interface TutorProfileHeaderProps {
  name: string;
  subject: string;
  rating: number;
  reviewCount: number;
  location: string;
  workType: string;
  tier?: string;
  avatar?: string;
  editButton?: ReactNode;
}

export function TutorProfileHeader({
  name,
  subject,
  editButton,
  rating,
  reviewCount,
  location,
  workType,
  tier = "Bạc",
  avatar,
}: TutorProfileHeaderProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Vàng":
        return "bg-warning-soft text-warning-foreground dark:bg-warning/20 dark:text-warning";
      case "Bạc":
        return "bg-muted text-foreground dark:bg-muted dark:text-foreground";
      default:
        return "bg-info-soft text-info-foreground dark:bg-info/20 dark:text-info";
    }
  };

  return (
    <Card className="overflow-hidden bg-card border border-border flex flex-col h-fit shadow-sm hover:shadow-md transition-shadow">
      {/* Header Background Gradient */}
      <div className="h-24 w-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent"></div>

      <div className="px-6 pb-6 -mt-12 flex flex-col gap-6">
        {/* Profile content */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-full blur-sm opacity-25 group-hover:opacity-50 transition-opacity"></div>
            <Image
              src={
                avatar ||
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(name)
              }
              alt={name}
              width={128}
              height={128}
              className="relative w-32 h-32 rounded-full border-4 border-background object-cover shadow-lg"
            />
            <Badge
              className={`absolute -bottom-1 -right-1 ${getTierColor(tier)} border-2 border-background shadow-md flex items-center gap-1 px-3 py-1 scale-110`}
            >
              <Medal className="size-3.5" />
              <span className="text-xs font-bold">{tier}</span>
            </Badge>
          </div>

          {/* Profile details - Center aligned */}
          <div className="text-center w-full">
            <h1 className="text-xl font-bold text-foreground">{name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subject}</p>

            {/* Rating */}
            <div className="flex items-center justify-center gap-1.5 mt-3 bg-warning-soft/50 dark:bg-warning/10 text-warning px-4 py-1.5 rounded-full inline-flex mx-auto border border-warning/10">
              <Star className="size-4 fill-warning animate-pulse" />
              <span className="text-sm font-bold">
                {rating}/5{" "}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({reviewCount} đánh giá)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Location and info - Below avatar */}
        <div className="w-full border-t border-border pt-6">
          <div className="flex flex-col gap-3 w-full text-sm text-muted-foreground">
            <div className="flex items-center gap-3 transition-colors hover:text-foreground">
              <MapPin className="size-4 text-primary" />
              <span className="font-medium">{location}, Việt Nam</span>
            </div>
            <div className="flex items-center gap-3 transition-colors hover:text-foreground">
              <Clock className="size-4 text-primary" />
              <span className="font-medium">{workType}</span>
            </div>
            <div className="flex items-center gap-3 transition-colors hover:text-foreground">
              <Award className="size-4 text-primary" />
              <span className="font-medium">Gói {tier}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 py-6 text-base font-bold">
            <Calendar className="size-5 mr-2" />
            Đặt lịch học ngay
          </Button>
          {editButton}
        </div>
      </div>
    </Card>
  );
}
