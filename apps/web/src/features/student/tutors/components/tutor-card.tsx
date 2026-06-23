"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  BookOpen,
  Briefcase,
  DollarSign,
  GraduationCap,
  School,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Tutor } from "../types";

interface TutorCardProps {
  tutor: Tutor;
  compact?: boolean;
}

export function TutorCard({ tutor, compact = false }: TutorCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
      <div className={compact ? "p-4 flex-1" : "p-5 flex-1"}>
        {/* Header with avatar, rating badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <Image
              src={tutor.avatar}
              alt={tutor.name}
              width={compact ? 48 : 64}
              height={compact ? 48 : 64}
              className={`${compact ? "size-12" : "size-16"} rounded-full border-2 border-primary ring-2 ring-primary/20 object-cover`}
            />
            {tutor.isOnline && (
              <div
                className={`absolute -bottom-1 -right-1 bg-success rounded-full border-2 border-card ${compact ? "size-3" : "size-4"}`}
                title="Đang online"
              />
            )}
          </div>
          <div className={`bg-warning/20 text-warning px-2.5 py-1 rounded-md font-bold flex items-center gap-1 ${compact ? "text-[10px]" : "text-xs"}`}>
            <Star className={`${compact ? "size-3" : "size-3.5"} fill-current`} />
            {tutor.rating.toFixed(1)}
            <span className="text-warning/70 font-normal">
              ({tutor.reviewCount})
            </span>
          </div>
        </div>

        {/* Name and specialty */}
        <h3 className={`font-bold text-foreground mb-1 line-clamp-1 ${compact ? "text-base" : "text-lg"}`}>{tutor.name}</h3>
        <p className={`text-primary font-medium ${compact ? "text-xs mb-2" : "text-sm mb-3"} line-clamp-1`}>
          {tutor.specialty}
        </p>

        {/* Info items */}
        <div className={`space-y-2 ${compact ? "mb-2 text-xs" : "mb-4 text-sm"}`}>
          {tutor.subjects.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 rounded-md bg-purple-soft text-purple">
                <BookOpen className={compact ? "size-3.5" : "size-4"} />
              </div>
              <span className="line-clamp-1">{tutor.subjects.join(", ")}</span>
            </div>
          )}
          {tutor.grades.length > 0 && !compact && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-1.5 rounded-md bg-indigo-soft text-indigo">
                <GraduationCap className={compact ? "size-3.5" : "size-4"} />
              </div>
              <span className="line-clamp-1">{tutor.grades.join(", ")}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className={compact ? "size-3.5" : "size-4"} />
            <span className="line-clamp-1">{tutor.experience}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <School className={compact ? "size-3.5" : "size-4"} />
              <span className="line-clamp-1">{tutor.education}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className={compact ? "size-3.5" : "size-4"} />
            <span className="font-semibold text-foreground line-clamp-1">
              {tutor.pricePerHour.toLocaleString("vi-VN")}đ
              <span className="font-normal text-muted-foreground text-[10px] ml-0.5">
                /giờ
              </span>
            </span>
          </div>
        </div>

        {/* Skills tags */}
        {!compact && (
          <div className="flex flex-wrap gap-2">
            {tutor.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className={`${compact ? "p-3" : "p-4"} border-t border-border bg-muted/50 flex gap-2 mt-auto`}>
        <Link href={`/student/tutors/${tutor.id}`} className="flex-1">
          <Button variant="outline" className="w-full text-xs" size={compact ? "sm" : "default"}>
            Xem hồ sơ
          </Button>
        </Link>
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-xs" size={compact ? "sm" : "default"}>
          Đăng ký
        </Button>
      </div>
    </div>
  );
}
