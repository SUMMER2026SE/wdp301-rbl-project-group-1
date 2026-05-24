import { Button } from "@/src/shared/components/ui/button";

import { certificateMeta } from "./tutor-approvals.constants";
import type { TutorApplication } from "./tutor-approvals.types";

type CertificateListProps = {
  certificates: TutorApplication["certificates"];
};

export function CertificateList({ certificates }: CertificateListProps) {
  return (
    <div className="flex items-center gap-2">
      {certificates.map((certificate) => {
        const meta = certificateMeta[certificate];
        const Icon = meta.icon;

        return (
          <Icon
            key={certificate}
            aria-label={meta.label}
            className={`size-5 ${meta.className}`}
          />
        );
      })}
      <Button variant="link" size="sm" className="h-auto px-0 text-xs">
        Xem
      </Button>
    </div>
  );
}
