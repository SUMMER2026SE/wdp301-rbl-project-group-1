import type { InputFieldDetail } from '@/src/shared/components/@types/input';

export type TextBoxPresenterProps = InputFieldDetail & {
  value?: string | number | readonly string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
