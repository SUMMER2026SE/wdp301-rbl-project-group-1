"use client";

interface SkillsBadgesProps {
  skills: string[];
}

export function SkillsBadges({ skills }: SkillsBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
