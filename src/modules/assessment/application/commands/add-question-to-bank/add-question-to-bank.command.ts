import {
  QuestionDifficulty,
  QuestionType,
} from '../../../../../shared/domain/enums/enums';

export interface OptionInput {
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

export class AddQuestionToBankCommand {
  constructor(
    public readonly bankId: string,
    public readonly type: QuestionType,
    public readonly difficulty: QuestionDifficulty,
    public readonly content: string,
    public readonly points: number,
    public readonly orderIndex: number,
    public readonly options: OptionInput[],
  ) {}
}
