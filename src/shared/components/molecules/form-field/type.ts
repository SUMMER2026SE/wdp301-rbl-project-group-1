import { ReactNode } from "react";
import {
  FieldPath,
  FieldValues,
  ControllerRenderProps,
  ControllerFieldState,
} from "react-hook-form";

export type FormFieldRenderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
};

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  render: (props: FormFieldRenderProps<TFieldValues, TName>) => ReactNode;
};

export type FormFieldWrapperProps = {
  label?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
};
