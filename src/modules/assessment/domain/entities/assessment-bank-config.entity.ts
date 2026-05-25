import { BaseEntity } from '../../../../shared/domain/entities/base-entity';
import { QuestionDifficulty } from '../../../../shared/domain/enums/enums';

export interface AssessmentBankConfigProps {
  assessmentId: string;
  bankId: string;
  difficulty?: QuestionDifficulty | null;
  count: number;
  pointsPerQuestion: number;
}

export class AssessmentBankConfig extends BaseEntity<string> {
  private props: AssessmentBankConfigProps;

  private constructor(id: string, props: AssessmentBankConfigProps) {
    super(id);
    this.props = props;
  }

  static create(
    id: string,
    props: AssessmentBankConfigProps,
  ): AssessmentBankConfig {
    return new AssessmentBankConfig(id, props);
  }

  get assessmentId(): string {
    return this.props.assessmentId;
  }

  get bankId(): string {
    return this.props.bankId;
  }

  get difficulty(): QuestionDifficulty | null | undefined {
    return this.props.difficulty;
  }

  get count(): number {
    return this.props.count;
  }

  get pointsPerQuestion(): number {
    return this.props.pointsPerQuestion;
  }
}
