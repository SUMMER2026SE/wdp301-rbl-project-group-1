import type { FieldValues } from 'react-hook-form';

import type { InputFormContainerProps } from '@/src/shared/components/@types/input';

import InputFormContainer from './input-form-container';

const InputForm = <TypeValues extends FieldValues>(props: InputFormContainerProps<TypeValues>) => {
  return <InputFormContainer {...props} />;
};

export default InputForm;
