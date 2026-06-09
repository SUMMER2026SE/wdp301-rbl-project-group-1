"use client";

import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { SkillsBadges } from "@/src/shared/components/atoms/skills-badge/skills-badges";
import { StatBadge } from "@/src/shared/components/molecules/stat-badge/stat-badge";
import { BookOpen, Calendar, Check, GraduationCap, Star, Users } from "lucide-react";
import type { Tutor } from "../types";

interface TutorInfoHeaderProps {
  tutor: Tutor;
}

export function TutorInfoHeader({ tutor }: TutorInfoHeaderProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar
            src={tutor.avatar}
            alt={tutor.name}
            fallback={tutor.name}
            size="2xl"
            showStatus={true}
            status={tutor.isOnline ? "online" : "offline"}
          />
        </div>

        {/* Info section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {tutor.name}
            </h1>
            <Check className="size-5 text-info" />
          </div>
          <p className="text-lg text-primary font-medium mb-4">
            {tutor.specialty}
          </p>

          {(tutor.subjects.length > 0 || tutor.grades.length > 0) && (
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-muted-foreground mb-6">
              {tutor.subjects.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-purple-soft text-purple">
                    <BookOpen className="size-4" />
                  </div>
                  <span>{tutor.subjects.join(", ")}</span>
                </div>
              )}
              {tutor.grades.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-indigo-soft text-indigo">
                    <GraduationCap className="size-4" />
                  </div>
                  <span>{tutor.grades.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-4 md:gap-8 mb-6">
            <StatBadge
              icon={<Star className="size-5 fill-current" />}
              iconBgColor="bg-info/20"
              iconColor="text-info"
              value={tutor.rating}
              subtext="/ 5"
              label={`${tutor.reviewCount} đánh giá`}
            />
            <StatBadge
              icon={<Calendar className="size-5" />}
              iconBgColor="bg-success/20"
              iconColor="text-success"
              value={tutor.teachingHours ?? "1,500+"}
              label="Giờ giảng dạy"
            />
            <StatBadge
              icon={<Users className="size-5" />}
              iconBgColor="bg-purple/20"
              iconColor="text-purple"
              value={tutor.studentCount ?? "350+"}
              label="Học sinh"
            />
          </div>

          {/* Skills */}
          <SkillsBadges skills={tutor.skills} />
        </div>
      </div>
    </div>
  );
}
