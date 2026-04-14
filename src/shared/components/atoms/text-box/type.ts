import type { ChangeEvent, FocusEventHandler, Ref } from "react";

import type { InputFieldDetail } from "@/src/shared/components/@types/input";

export type TextBoxPresenterProps = InputFieldDetail & {
  value?: string | number | readonly string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  reference?: Ref<HTMLInputElement>;
  error?: string;
  icon?: string;
  className?: string;
  inputClassName?: string;
};
