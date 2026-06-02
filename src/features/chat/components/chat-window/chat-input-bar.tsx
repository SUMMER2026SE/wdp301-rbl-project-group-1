"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Plus, Send, Smile } from "lucide-react";
import { useState } from "react";

export function ChatInputBar() {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    // TODO: integrate with chat API after backend is ready
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 px-6 py-4 border-t border-border bg-background shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <Smile className="size-5" />
      </Button>

      <Textarea
        placeholder="Nhập tin nhắn..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="flex-1 resize-none min-h-[40px] max-h-32 py-2"
      />

      <Button
        size="icon"
        className="shrink-0"
        onClick={handleSend}
        disabled={!value.trim()}
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}
