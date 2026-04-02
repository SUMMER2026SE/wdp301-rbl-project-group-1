import { FormProvider, useForm, type FieldValues } from 'react-hook-form';

import type { InputFormContainerProps } from '@/src/shared/components/@types/input';
import { RequestCorrelationCheckProvider } from '@/src/shared/context/request-correlation-check';

import InputFormPresenter from './input-form-presenter';

const InputFormContainer = <TypeValues extends FieldValues>(
  props: InputFormContainerProps<TypeValues>
) => {
  const { defaultValues, onSubmit, ...rest } = props;

  const methods = useForm<TypeValues>({
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <RequestCorrelationCheckProvider>
      <FormProvider {...methods}>
        <InputFormPresenter onSubmit={handleSubmit(onSubmit)} {...rest} />
      </FormProvider>
    </RequestCorrelationCheckProvider>
  );
};

export default InputFormContainer;
