import React, { type PropsWithChildren } from 'react';

export type InputFormPresenterProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  id?: string;
};

const InputFormPresenter: React.FC<InputFormPresenterProps & PropsWithChildren> = ({
  onSubmit,
  children,
  id = 'input-form',
}) => {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl px-8 py-10 space-y-6 backdrop-blur"
    >
      {children}
    </form>
  );
};

export default InputFormPresenter;
