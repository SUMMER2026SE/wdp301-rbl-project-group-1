import { FormProvider, useForm, type FieldValues } from 'react-hook-form';

import type { InputFormContainerProps } from '@/src/shared/components/@types/input';
import { RequestCorrelationCheckProvider } from '@/src/shared/context/request-correlation-check';

import InputFormPresenter from './input-form-presenter';

const InputFormContainer = <TypeValues extends FieldValues>(
  props: InputFormContainerProps<TypeValues>
) => {
  const { defaultValues, resolver, onSubmit, className, ...rest } = props;
  const methods = useForm<TypeValues>({
    resolver,
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <RequestCorrelationCheckProvider>
      <FormProvider {...methods}>
        <InputFormPresenter onSubmit={handleSubmit(onSubmit)} className={className} {...rest} />
      </FormProvider>
    </RequestCorrelationCheckProvider>
  );
};

export default InputFormContainer;
