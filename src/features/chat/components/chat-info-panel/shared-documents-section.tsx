import { Button } from "@/src/shared/components/ui/button";
import { FileText, Image } from "lucide-react";
import type { AttachmentType, SharedDocument } from "../../types";
import { formatFileSize } from "../chat-window/message-bubble";

interface SharedDocumentsSectionProps {
  documents: SharedDocument[];
}

function formatSharedTime(date: Date): string {
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hôm qua";
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

function DocTypeIcon({ type }: { type: AttachmentType }) {
  if (type === "pdf") {
    return (
      <div className="size-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center shrink-0">
        <FileText className="size-4" />
      </div>
    );
  }
  return (
    <div className="size-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
      <Image className="size-4" />
    </div>
  );
}

export function SharedDocumentsSection({
  documents,
}: SharedDocumentsSectionProps) {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">
          Tài liệu đã chia sẻ
        </h4>
        <Button
          variant="link"
          size="sm"
          className="text-primary h-auto p-0 text-xs font-medium"
        >
          Xem tất cả
        </Button>
      </div>
      <div className="space-y-3">
        {documents.slice(0, 3).map((doc) => (
          <div key={doc.id} className="flex items-center gap-3">
            <DocTypeIcon type={doc.type} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {doc.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatSharedTime(doc.sharedAt)} • {formatFileSize(doc.size)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
