import type { ReactNode } from 'react';

export interface ModalPresenterProps {
  trigger?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  formId?: string;
  open: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ModalContainerProps {
  trigger?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  formId?: string;
}
