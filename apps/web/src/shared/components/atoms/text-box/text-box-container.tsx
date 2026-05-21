import TextBoxPresenter from './text-box-presenter';
import type { TextBoxPresenterProps } from './type';

const TextBoxContainer = (props: TextBoxPresenterProps) => {
  return <TextBoxPresenter {...props} />;
};

export default TextBoxContainer;
