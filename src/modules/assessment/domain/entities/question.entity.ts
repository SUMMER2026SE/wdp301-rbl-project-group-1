import { BaseEntity } from '../../../../shared/domain/entities/base-entity';
import {
  QuestionDifficulty,
  QuestionType,
} from '../../../../shared/domain/enums/enums';

export interface OptionProps {
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface QuestionProps {
  assessmentId?: string | null;
  bankId?: string | null;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  content: string;
  points: number;
  orderIndex: number;
  options: OptionData[];
}

export interface OptionData {
  id: string;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

export class Question extends BaseEntity<string> {
  private props: QuestionProps;

  private constructor(id: string, props: QuestionProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: QuestionProps): Question {
    return new Question(id, props);
  }

  get assessmentId(): string | null | undefined {
    return this.props.assessmentId;
  }

  get bankId(): string | null | undefined {
    return this.props.bankId;
  }

  get type(): QuestionType {
    return this.props.type;
  }

  get difficulty(): QuestionDifficulty {
    return this.props.difficulty;
  }

  get content(): string {
    return this.props.content;
  }

  get points(): number {
    return this.props.points;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  get options(): OptionData[] {
    return this.props.options;
  }

  get correctOptionIds(): string[] {
    return this.props.options.filter((o) => o.isCorrect).map((o) => o.id);
  }

  update(
    fields: Partial<
      Pick<
        QuestionProps,
        'type' | 'difficulty' | 'content' | 'points' | 'orderIndex'
      >
    >,
  ): void {
    if (fields.type !== undefined) this.props.type = fields.type;
    if (fields.difficulty !== undefined)
      this.props.difficulty = fields.difficulty;
    if (fields.content !== undefined) this.props.content = fields.content;
    if (fields.points !== undefined) this.props.points = fields.points;
    if (fields.orderIndex !== undefined)
      this.props.orderIndex = fields.orderIndex;
  }

  updateOptions(options: OptionData[]): void {
    this.props.options = options;
  }
}
