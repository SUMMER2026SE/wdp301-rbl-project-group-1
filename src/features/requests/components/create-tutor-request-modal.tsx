"use client";

import React, { useRef } from "react";
import { PlusCircle, X } from "lucide-react";

import { DialogClose } from "@/src/shared/components/ui/dialog";
import { Button } from "@/src/shared/components/ui/button";
import Modal from "@/src/shared/components/molecules/modal/modal";

import { CreateTutorRequestForm } from "./create-tutor-request-form";

interface CreateTutorRequestModalProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

const CustomHeader = () => (
  <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 sticky top-0 z-10 w-full">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
        <PlusCircle className="text-primary size-5" />
      </div>
      <h2 className="text-xl font-bold text-foreground tracking-tight">Tạo Yêu Cầu Mới</h2>
    </div>
    <DialogClose asChild>
      <Button 
        variant="ghost" 
        className="size-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground active:scale-90 p-0"
      >
        <X className="size-5" />
      </Button>
    </DialogClose>
  </div>
);

export function CreateTutorRequestModal({ trigger, onSuccess }: CreateTutorRequestModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleCancel = () => {
    closeRef.current?.click();
  };

  const handleSuccess = () => {
    closeRef.current?.click();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Modal
      trigger={trigger}
      title="Tạo Yêu Cầu Mới"
      description=""
      formId="create-tutor-request-form"
      contentClassName="max-w-4xl sm:max-w-4xl p-0 gap-0 overflow-hidden bg-background rounded-3xl"
      hideDefaultFooter={true}
      customHeader={<CustomHeader />}
    >
      {/* Hidden close trigger for programmatic closing */}
      <DialogClose asChild>
        <button ref={closeRef} className="hidden">Close</button>
      </DialogClose>
      
      <CreateTutorRequestForm 
        onSuccess={handleSuccess} 
        onCancel={handleCancel} 
      />
    </Modal>
  );
}
