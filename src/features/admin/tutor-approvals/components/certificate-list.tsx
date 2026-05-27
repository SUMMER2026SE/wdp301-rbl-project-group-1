import { Button } from "@/src/shared/components/ui/button";
import { FileText } from "lucide-react";

type FileListProps = {
  files?: string[];
};

/**
 * Renders a list of file links attached to a tutor application.
 * Can be used in a detail view or expanded row.
 */
export function CertificateList({ files }: FileListProps) {
  if (!files || files.length === 0) {
    return <span className="text-xs text-muted-foreground">Không có</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {files.map((file, index) => (
        <FileText
          key={index}
          aria-label={`File ${index + 1}`}
          className="size-5 text-info"
        />
      ))}
      <Button variant="link" size="sm" className="h-auto px-0 text-xs">
        Xem
      </Button>
    </div>
  );
}
