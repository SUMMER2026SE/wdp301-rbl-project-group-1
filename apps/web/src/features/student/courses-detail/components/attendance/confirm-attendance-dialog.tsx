"use client";

import { useState } from "react";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Label } from "@/src/shared/components/ui/label";
import { useMarkSessionAttendanceMutation } from "@/src/features/booking/bookingApi";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface ConfirmAttendanceDialogProps {
  sessionId: string;
  sessionIndex: number;
  sessionTitle?: string;
  tutorName: string;
}

export function ConfirmAttendanceDialog({
  sessionId,
  sessionIndex,
  sessionTitle,
  tutorName,
}: ConfirmAttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [confirmAttendance, { isLoading }] = useMarkSessionAttendanceMutation();

  const handleConfirm = async () => {
    try {
      await confirmAttendance({
        sessionId,
        markSessionAttendanceDto: {
          notes: notes.trim() || undefined,
        },
      }).unwrap();
      setOpen(false);
      setNotes("");
    } catch (error) {
      console.error("Failed to confirm attendance", error);
      // In a real app, you would show a toast error here
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl">
          <CheckCircle2 className="size-4" />
          Xác nhận buổi học
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="size-5 text-indigo-500" />
            Xác nhận hoàn thành
          </DialogTitle>
          <DialogDescription>
            Xác nhận bạn đã tham gia buổi học với gia sư <span className="font-semibold text-foreground">{tutorName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-muted/30 border border-border">
            <p className="font-medium text-sm text-foreground">
              Buổi {sessionIndex}{sessionTitle ? `: ${sessionTitle}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Việc xác nhận sẽ đánh dấu buổi học này là hoàn thành và gia sư sẽ nhận được thanh toán cho buổi học này.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Nhận xét / Ghi chú (Không bắt buộc)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về buổi học này..."
              className="resize-none h-24 rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="rounded-xl">
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
