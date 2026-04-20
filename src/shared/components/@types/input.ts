import type { FieldValues, UseFormProps } from 'react-hook-form';

export type ValueType = string | number | boolean | Date | string[] | File | FileList;

export type ValidationsType = Record<
  string,
  | 'EmptyFile'
  | 'Required'
  | 'MaxLength'
  | 'MinLength'
  | 'FileSize'
  | 'Regex'
  | 'MaxRange'
  | 'MinRange'
  | 'DecimalDigit'
>;

export type InputComponentMetaData = {
  id: string;
  label?: string;
  name: string;
  type?: string;
  default?: ValueType;
  placeholder?: string;
  validation?: ValidationsType;
};

export type Option = {
  label: string;
  value: string | number;
};

export type SingleLineText = InputComponentMetaData;
export type MultipleLineText = InputComponentMetaData;
export type RadioButton = (Option[] & InputComponentMetaData) | undefined;
export type ToggleButton = (Option[] & InputComponentMetaData) | undefined;
export type CheckBox = { option?: Option[]; selectAbleNumber?: number } & InputComponentMetaData;
export type Pulldown = { options?: Option[] } & InputComponentMetaData;
export type SingleLineNumber = InputComponentMetaData;
export type FileUpload = InputComponentMetaData;
export type DateTimeInput = InputComponentMetaData;
export type DateInput = InputComponentMetaData;
export type YearMonthInput = InputComponentMetaData;
export type TimingInput = InputComponentMetaData;

export type InputFieldDetail =
  | SingleLineText
  | MultipleLineText
  | RadioButton
  | ToggleButton
  | CheckBox
  | Pulldown
  | SingleLineNumber
  | FileUpload
  | DateTimeInput
  | DateInput
  | YearMonthInput
  | TimingInput;

export type InputFormContainerProps<TForm extends FieldValues> = {
  resolver?: UseFormProps<TForm>['resolver'];
  defaultValues: UseFormProps<TForm>['defaultValues'];
  onSubmit: (data: TForm) => void;
  children: React.ReactNode;
  id?: string;
  className?: string;
};
