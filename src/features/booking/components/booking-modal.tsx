"use client";

import React from "react";
import Modal from "@/src/shared/components/molecules/modal/modal";
import { Calendar, X } from "lucide-react";
import { DialogClose } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import { BookingForm } from "./booking-form";

interface BookingModalProps {
  trigger: React.ReactNode;
}

const CustomHeader = () => (
  <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 sticky top-0 z-10 w-full">
    <div className="flex items-center gap-3">
      <Calendar className="text-primary size-6" />
      <h2 className="text-xl font-bold text-foreground">Đặt lịch học với Gia sư</h2>
    </div>
    <DialogClose asChild>
      <Button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground active:scale-90">
        <X className="size-5" />
      </Button>
    </DialogClose>
  </div>
);

export function BookingModal({ trigger }: BookingModalProps) {
  return (
    <Modal
      trigger={trigger}
      title="Đặt lịch học với Gia sư"
      description=""
      formId="booking-form"
      contentClassName="max-w-5xl sm:max-w-5xl p-0 gap-0 overflow-hidden bg-background"
      hideDefaultFooter={true}
      customHeader={<CustomHeader />}
    >
      <BookingForm />
    </Modal>
  );
}
