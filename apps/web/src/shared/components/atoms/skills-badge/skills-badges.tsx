import { Badge } from "@/src/shared/components/ui/badge";
import { cn } from "@/src/shared/lib/utils";

interface SkillsBadgesProps {
  skills: string[];
  className?: string; // Cho phép parent custom style (margin, padding...)
}

export function SkillsBadges({ skills, className }: SkillsBadgesProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {skills.map((skill) => (
        <Badge
          key={skill}
          variant="secondary"
          className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 hover:text-muted-foreground"
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}
