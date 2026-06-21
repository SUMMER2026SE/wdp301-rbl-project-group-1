"use client";

import React from "react";
import Modal from "@/src/shared/components/molecules/modal/modal";
import { Sparkles, X } from "lucide-react";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import { RenewBookingForm } from "./renew-booking-form";

interface RenewBookingModalProps {
  trigger: React.ReactNode;
  bookingId: string;
  tutorId?: string;
  tutorName: string;
  pricePerHour: number;
  tutorAvailableSlots?: Record<string, boolean>;
}

const CustomHeader = () => (
  <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 sticky top-0 z-10 w-full">
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="text-primary size-5" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Gia hạn khoá học</h2>
    </div>
    <DialogClose asChild>
      <Button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground active:scale-90">
        <X className="size-5" />
      </Button>
    </DialogClose>
  </div>
);

export function RenewBookingModal({
  trigger,
  bookingId,
  tutorId,
  tutorName,
  pricePerHour,
  tutorAvailableSlots,
}: RenewBookingModalProps) {
  return (
    <Modal
      trigger={trigger}
      title="Gia hạn khoá học"
      description=""
      formId="renew-booking-form"
      contentClassName="max-w-5xl sm:max-w-5xl p-0 gap-0 overflow-hidden bg-background"
      hideDefaultFooter={true}
      customHeader={<CustomHeader />}
    >
      <RenewBookingForm
        bookingId={bookingId}
        tutorId={tutorId}
        tutorName={tutorName}
        pricePerHour={pricePerHour}
        tutorAvailableSlots={tutorAvailableSlots}
      />
    </Modal>
  );
}
