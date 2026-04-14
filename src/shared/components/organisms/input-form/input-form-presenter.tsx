import React, { type PropsWithChildren } from "react";

export type InputFormPresenterProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  id?: string;
};

const InputFormPresenter: React.FC<
  InputFormPresenterProps & PropsWithChildren
> = ({ onSubmit, children, id = "input-form" }) => {
  return (
    <form
      id={id}
      onSubmit={onSubmit}
      noValidate
      className="w-full max-w-md backdrop-blur"
    >
      {children}
    </form>
  );
};

export default InputFormPresenter;
