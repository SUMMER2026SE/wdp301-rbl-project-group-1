import { withFormController, type FormController } from '@/src/shared/hocs/with-form-controller';
import CheckboxFieldContainer from './checkbox-field-container';
import type { CheckboxFieldPresenterProps } from './type';

const CheckboxField = withFormController<FormController & CheckboxFieldPresenterProps>(CheckboxFieldContainer);
export default CheckboxField;
