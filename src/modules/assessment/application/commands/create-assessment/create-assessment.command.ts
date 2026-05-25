import {
  AssessmentType,
  GradingPolicy,
  QuestionDifficulty,
} from '../../../../../shared/domain/enums/enums';

export interface BankConfigInput {
  bankId: string;
  difficulty?: QuestionDifficulty;
  count: number;
  pointsPerQuestion: number;
}

export class CreateAssessmentCommand {
  constructor(
    public readonly courseId: string,
    public readonly title: string,
    public readonly type: AssessmentType,
    public readonly gradingPolicy: GradingPolicy,
    public readonly isRandomized: boolean,
    public readonly shuffleOptions: boolean,
    public readonly antiCheat: boolean,
    public readonly bankConfigs: BankConfigInput[],
    public readonly lessonId?: string,
    public readonly description?: string,
    public readonly maxAttempts?: number,
    public readonly timeLimit?: number,
    public readonly passScore?: number,
  ) {}
}
