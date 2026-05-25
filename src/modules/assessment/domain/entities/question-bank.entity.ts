import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';

export interface QuestionBankProps {
  courseId: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class QuestionBank extends AggregateRoot<string> {
  private props: QuestionBankProps;

  private constructor(id: string, props: QuestionBankProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: QuestionBankProps): QuestionBank {
    return new QuestionBank(id, props);
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(
    fields: Partial<Pick<QuestionBankProps, 'title' | 'description'>>,
  ): void {
    if (fields.title !== undefined) this.props.title = fields.title;
    if (fields.description !== undefined)
      this.props.description = fields.description;
  }
}
