import { withFormController, type FormController } from '@/src/shared/hocs/with-form-controller';
import SelectBoxContainer from './select-box-container';
import type { SelectBoxPresenterProps } from './type';

const SelectBox = withFormController<FormController & SelectBoxPresenterProps>(SelectBoxContainer);
export default SelectBox;
