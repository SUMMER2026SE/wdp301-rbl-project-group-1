import { withFormController, type FormController } from '@/src/shared/hocs/with-form-controller';

import TextBoxContainer from './text-box-container';
import type { TextBoxPresenterProps } from './type';

const TextBox = withFormController<FormController & TextBoxPresenterProps>(TextBoxContainer);

export default TextBox;
