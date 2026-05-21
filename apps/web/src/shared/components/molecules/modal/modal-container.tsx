import { useModalContext } from '@/src/shared/context/modal-context';

import ModalPresenter from './modal-presenter';
import type { ModalContainerProps } from './type';

const ModalContainer = ({
  trigger,
  title,
  description,
  children,
  confirmText,
  cancelText = 'Cancel',
  formId = 'input-form',
}: ModalContainerProps) => {
  const modalContext = useModalContext();

  if (!modalContext) {
    throw new Error('Modal must be used within ModalProvider');
  }

  const { isOpen, isSubmitting } = modalContext;

  const handleOpenChange = (open: boolean) => {
    if (open) {
      modalContext.openModal();
    } else {
      modalContext.closeModal();
    }
  };

  return (
    <ModalPresenter
      trigger={trigger}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      formId={formId}
      open={isOpen}
      isSubmitting={isSubmitting}
      onOpenChange={handleOpenChange}
    >
      {children}
    </ModalPresenter>
  );
};

export default ModalContainer;
