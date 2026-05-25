import { BaseEntity } from '../../../../shared/domain/entities/base-entity';

export interface AttemptAnswerProps {
  attemptId: string;
  questionId: string;
  optionIds: string[];
  textAnswer?: string | null;
  isCorrect?: boolean | null;
  points?: number | null;
}

export class AttemptAnswer extends BaseEntity<string> {
  private props: AttemptAnswerProps;

  private constructor(id: string, props: AttemptAnswerProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: AttemptAnswerProps): AttemptAnswer {
    return new AttemptAnswer(id, props);
  }

  get attemptId(): string {
    return this.props.attemptId;
  }

  get questionId(): string {
    return this.props.questionId;
  }

  get optionIds(): string[] {
    return this.props.optionIds;
  }

  get textAnswer(): string | null | undefined {
    return this.props.textAnswer;
  }

  get isCorrect(): boolean | null | undefined {
    return this.props.isCorrect;
  }

  get points(): number | null | undefined {
    return this.props.points;
  }

  grade(isCorrect: boolean, points: number): void {
    this.props.isCorrect = isCorrect;
    this.props.points = points;
  }
}
