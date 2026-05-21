import React from "react";
import {
  Controller,
  type ControllerRenderProps,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";

type ExcludeType = "value";

export type ValidationRules = Exclude<
  RegisterOptions,
  "valueAsNumber" | "valueAsDate" | "setValueAs"
>;

export type FormController = Partial<
  Pick<ControllerRenderProps, "onChange" | "onBlur">
> & {
  name: string;
  value?: string | boolean | Date | FileList | null;
  defaultValue?: string | boolean | Date | FileList | null;
  validationRules?: ValidationRules;
  selected?: Date | null;
  error?: Record<string, string | string[]> | string;
  reference?: React.Ref<unknown>;
  ariaLabel?: string;
  isDisplayErrorInline?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  isClearable?: boolean;
  selectStyle?: React.CSSProperties;
};

export type ControllerChangeEvent =
  | React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >
  | Date
  | null
  | string;

export const withFormController = <P extends object>(
  Component: React.ComponentType<P & FormController>,
): React.NamedExoticComponent<
  Omit<P, "onChange"> & Omit<FormController, ExcludeType>
> => {
  const Wrapped = React.memo(
    ({
      name,
      defaultValue,
      onChange: onChangeProps,
      onBlur: onBlurProps,
      validationRules,
      error,
      ariaLabel,
      ...rest
    }: Omit<P, "onChange"> & Omit<FormController, ExcludeType>) => {
      const { control } = useFormContext();

      const handleOnChange =
        (onChange: (event: ControllerChangeEvent) => void) =>
        (event: ControllerChangeEvent): void => {
          onChange(event);
          setTimeout(() => {
            if (onChangeProps) {
              onChangeProps(event);
            }
          });
        };

      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={validationRules}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState,
          }): React.ReactElement => (
            <Component
              {...(rest as P & FormController)}
              name={name}
              value={value}
              selected={value as Date}
              onChange={handleOnChange(onChange)}
              onBlur={onBlurProps || onBlur}
              reference={ref}
              error={error || fieldState.error?.message}
              ariaLabel={ariaLabel}
            />
          )}
        />
      );
    },
  );

  Wrapped.displayName = `${Component.displayName || Component.name || "Component"})`;

  return Wrapped as React.NamedExoticComponent<
    Omit<P, "onChange"> & Omit<FormController, ExcludeType>
  >;
};
