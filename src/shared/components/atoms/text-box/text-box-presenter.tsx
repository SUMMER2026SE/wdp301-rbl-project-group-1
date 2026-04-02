import React from 'react';

import { Input } from '@/src/shared/components/ui/input';
import { Label } from '@/src/shared/components/ui/label';

import type { TextBoxPresenterProps } from './type';

const TextBoxPresenter: React.FC<TextBoxPresenterProps> = ({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="border border-border shadow-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>
  );
};
export default TextBoxPresenter;
