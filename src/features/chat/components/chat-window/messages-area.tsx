"use client";

import { useEffect, useRef } from "react";
import type { Message } from "../../types";
import { MessageBubble } from "./message-bubble";

interface MessagesAreaProps {
  messages: Message[];
}

function formatDateSeparator(date: Date): string {
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Hôm nay";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hôm qua";
  return `${date.getDate()} Tháng ${date.getMonth() + 1}`;
}

interface MessageGroup {
  dateKey: string;
  date: Date;
  messages: Message[];
}

function groupByDate(messages: Message[]): MessageGroup[] {
  return messages.reduce<MessageGroup[]>((acc, msg) => {
    const d = new Date(msg.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const last = acc[acc.length - 1];
    if (last?.dateKey === key) {
      last.messages.push(msg);
    } else {
      acc.push({ dateKey: key, date: d, messages: [msg] });
    }
    return acc;
  }, []);
}

export function MessagesArea({ messages }: MessagesAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groups = groupByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {groups.map((group) => (
        <div key={group.dateKey}>
          {/* Date separator */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDateSeparator(group.date)}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {group.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
