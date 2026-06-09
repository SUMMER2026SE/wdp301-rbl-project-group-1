import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { BellOff, Search, User } from "lucide-react";
import type { ConversationDetail } from "../../types";
import { SharedDocumentsSection } from "./shared-documents-section";
import { UpcomingSessionCard } from "./upcoming-session-card";

interface ChatInfoPanelProps {
  detail: ConversationDetail;
}

const ACTION_BUTTONS = [
  { icon: User, label: "Hồ sơ" },
  { icon: BellOff, label: "Tắt báo" },
  { icon: Search, label: "Tìm" },
] as const;

export function ChatInfoPanel({ detail }: ChatInfoPanelProps) {
  const isOnline = detail.participant?.status === "online";

  return (
    <div className="w-72 flex flex-col border-l border-border bg-background shrink-0 overflow-y-auto">
      {/* Profile section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-border">
        <Avatar
          src={detail.avatar}
          fallback={detail.name}
          size="2xl"
          status={detail.participant?.status ?? "offline"}
          showStatus={isOnline}
          className="mb-4"
        />
        <h3 className="text-base font-semibold text-foreground text-center">
          {detail.name}
        </h3>
        {detail.participant?.role && (
          <p className="text-sm text-muted-foreground text-center mt-1">
            {detail.participant.role}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-6 mt-5">
          {ACTION_BUTTONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="size-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Icon className="size-4" />
              </div>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shared documents */}
      {detail.sharedDocuments.length > 0 && (
        <SharedDocumentsSection documents={detail.sharedDocuments} />
      )}

      {/* Upcoming session */}
      {detail.upcomingSession && (
        <UpcomingSessionCard session={detail.upcomingSession} />
      )}
    </div>
  );
}
