"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Briefcase, DollarSign, GraduationCap, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Tutor } from "../types";

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
      <div className="p-5 flex-1">
        {/* Header with avatar, rating badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="relative">
            <Image
              src={tutor.avatar}
              alt={tutor.name}
              width={64}
              height={64}
              className="size-16 rounded-full border-2 border-primary ring-2 ring-primary/20"
            />
            {tutor.isOnline && (
              <div
                className="absolute -bottom-1 -right-1 bg-success size-4 rounded-full border-2 border-card"
                title="Đang online"
              />
            )}
          </div>
          <div className="bg-warning/20 text-warning px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
            <Star className="size-3.5 fill-current" />
            {tutor.rating.toFixed(1)}
            <span className="text-warning/70 font-normal">
              ({tutor.reviewCount})
            </span>
          </div>
        </div>

        {/* Name and specialty */}
        <h3 className="font-bold text-lg text-foreground mb-1">{tutor.name}</h3>
        <p className="text-primary text-sm font-medium mb-3">
          {tutor.specialty}
        </p>

        {/* Info items */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4" />
            <span>{tutor.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="size-4" />
            <span>{tutor.education}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="size-4" />
            <span className="font-semibold text-foreground">
              {tutor.pricePerHour.toLocaleString("vi-VN")}đ
              <span className="font-normal text-muted-foreground text-xs">
                {" "}
                /giờ
              </span>
            </span>
          </div>
        </div>

        {/* Skills tags */}
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
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-border bg-muted/50 flex gap-3 mt-auto">
        <Link href={`/student/tutors/${tutor.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Xem hồ sơ
          </Button>
        </Link>
        <Button className="flex-1 bg-primary hover:bg-primary/90">
          Đăng ký học
        </Button>
      </div>
    </div>
  );
}
