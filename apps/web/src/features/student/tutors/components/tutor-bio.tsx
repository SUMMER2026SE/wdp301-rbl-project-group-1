interface TutorBioProps {
  bio: string;
}

export function TutorBio({ bio }: TutorBioProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Giới thiệu bản thân
      </h2>
      <div className="text-muted-foreground space-y-4 font-normal leading-relaxed whitespace-pre-wrap">
        {bio}
      </div>
    </div>
  );
}
