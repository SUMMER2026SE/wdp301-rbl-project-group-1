import type {
  InputComponentMetaData,
  Option,
} from "@/src/shared/components/@types/input";

export type SelectBoxPresenterProps = InputComponentMetaData & {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  className?: string;
  triggerClassName?: string;
};
