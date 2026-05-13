import { Award } from "lucide-react";
import Image from "next/image";
import type { Certification } from "../types";

interface TutorCertificationsProps {
  certifications: Certification[];
}

export function TutorCertifications({
  certifications,
}: TutorCertificationsProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Bằng cấp &amp; Chứng chỉ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 flex items-start gap-4 hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="size-12 rounded-lg bg-info/20 flex items-center justify-center text-info flex-shrink-0">
              <Award className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {cert.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {cert.issuer} • {cert.year}
              </p>
              {cert.image && (
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={100}
                  height={64}
                  className="h-16 w-auto rounded border border-border object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
