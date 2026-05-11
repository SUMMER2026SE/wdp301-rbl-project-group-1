import type { TeachingExperience } from "../types";

interface TutorExperienceProps {
  experiences: TeachingExperience[];
}

export function TutorExperience({ experiences }: TutorExperienceProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6">
        Kinh nghiệm giảng dạy
      </h2>
      <div className="relative border-l-2 border-border ml-3 md:ml-4 space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pl-6 md:pl-8">
            <div
              className={`absolute -left-[9px] top-1 size-4 rounded-full ring-4 ring-card ${
                exp.isCurrent ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`mb-1 text-sm font-bold ${exp.isCurrent ? "text-primary" : "text-muted-foreground"}`}
            >
              {exp.year}
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {exp.position}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">{exp.school}</p>
            <p className="text-foreground mt-2 font-normal text-sm md:text-base">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
