import type { InputComponentMetaData } from "@/src/shared/components/@types/input";
import type { ReactNode } from "react";

export type CheckboxFieldPresenterProps = InputComponentMetaData & {
  value?: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  className?: string;
  children?: ReactNode;
};
