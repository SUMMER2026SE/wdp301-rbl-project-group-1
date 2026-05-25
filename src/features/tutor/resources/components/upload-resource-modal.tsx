"use client";

import Modal from "@/src/shared/components/molecules/modal/modal";
import { UploadResourceForm } from "./upload-resource-form";

interface UploadResourceModalProps {
  trigger?: React.ReactNode;
}

export function UploadResourceModal({ trigger }: UploadResourceModalProps) {
  return (
    <Modal
      trigger={trigger}
      title="Tải lên tài liệu mới"
      description=""
      confirmText="Xác nhận tải lên"
      cancelText="Hủy"
      formId="upload-resource-form"
    >
      <UploadResourceForm />
    </Modal>
  );
}
