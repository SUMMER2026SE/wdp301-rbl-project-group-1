import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { cn } from "@/src/shared/lib/utils";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import type { AttachmentType, Message, MessageAttachment } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AttachmentFileIcon({ type }: { type: AttachmentType }) {
  if (type === "pdf") return <FileText className="size-5 text-red-500" />;
  if (type === "image") return <ImageIcon className="size-5 text-blue-500" />;
  return <FileText className="size-5 text-muted-foreground" />;
}

function AttachmentCard({
  attachment,
  isOwn,
}: {
  attachment: MessageAttachment;
  isOwn: boolean;
}) {
  return (
    <a
      href={attachment.url}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border mt-2 transition-opacity hover:opacity-80",
        isOwn ? "bg-white/10 border-white/20" : "bg-background border-border",
      )}
      onClick={(e) => e.preventDefault()}
    >
      <AttachmentFileIcon type={attachment.type} />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs font-medium truncate",
            isOwn ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {attachment.name}
        </p>
        <p
          className={cn(
            "text-xs",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <Download
        className={cn(
          "size-4 shrink-0",
          isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      />
    </a>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-2",
        message.isOwn ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!message.isOwn && (
        <Avatar
          src={message.senderAvatar}
          fallback={message.senderName}
          size="sm"
          className="shrink-0 mb-1"
        />
      )}

      <div
        className={cn(
          "max-w-[70%] flex flex-col",
          message.isOwn ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm",
            message.isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm",
          )}
        >
          {message.content && (
            <p className="leading-relaxed">{message.content}</p>
          )}
          {message.attachments?.map((att) => (
            <AttachmentCard
              key={att.id}
              attachment={att}
              isOwn={message.isOwn}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground px-1 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
