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
  contentClassName?: string;
  hideDefaultFooter?: boolean;
  customHeader?: ReactNode;
}

export interface ModalContainerProps {
  trigger?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  formId?: string;
  contentClassName?: string;
  hideDefaultFooter?: boolean;
  customHeader?: ReactNode;
}
