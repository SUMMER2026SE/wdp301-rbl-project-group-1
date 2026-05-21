import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  isSubmitting?: boolean;
  openModal: () => void;
  closeModal: () => void;
  setModalSubmitting: (isSubmitting: boolean) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const initialModalState: Pick<ModalContextType, 'isOpen' | 'isSubmitting'> = {
  isOpen: false,
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] =
    useState<Pick<ModalContextType, 'isOpen' | 'isSubmitting'>>(initialModalState);

  const openModal = (): void => {
    setModal((prev) => ({ ...prev, isOpen: true }));
  };

  const closeModal = (): void => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const setModalSubmitting = (isSubmitting: boolean): void => {
    setModal((prev) => ({ ...prev, isSubmitting }));
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen: modal.isOpen,
        isSubmitting: modal.isSubmitting,
        openModal,
        closeModal,
        setModalSubmitting,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = (): ModalContextType | null => {
  return useContext(ModalContext);
};
