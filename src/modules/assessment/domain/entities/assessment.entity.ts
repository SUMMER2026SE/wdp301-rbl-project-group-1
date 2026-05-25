import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import {
  AssessmentType,
  GradingPolicy,
} from '../../../../shared/domain/enums/enums';

export interface AssessmentProps {
  courseId: string;
  lessonId?: string | null;
  title: string;
  description?: string | null;
  type: AssessmentType;
  maxAttempts?: number | null;
  timeLimit?: number | null;
  isRandomized: boolean;
  shuffleOptions: boolean;
  antiCheat: boolean;
  passScore?: number | null;
  gradingPolicy: GradingPolicy;
  createdAt: Date;
  updatedAt: Date;
}

export class Assessment extends AggregateRoot<string> {
  private props: AssessmentProps;

  private constructor(id: string, props: AssessmentProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: AssessmentProps): Assessment {
    return new Assessment(id, props);
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get lessonId(): string | null | undefined {
    return this.props.lessonId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null | undefined {
    return this.props.description;
  }

  get type(): AssessmentType {
    return this.props.type;
  }

  get maxAttempts(): number | null | undefined {
    return this.props.maxAttempts;
  }

  get timeLimit(): number | null | undefined {
    return this.props.timeLimit;
  }

  get isRandomized(): boolean {
    return this.props.isRandomized;
  }

  get shuffleOptions(): boolean {
    return this.props.shuffleOptions;
  }

  get antiCheat(): boolean {
    return this.props.antiCheat;
  }

  get passScore(): number | null | undefined {
    return this.props.passScore;
  }

  get gradingPolicy(): GradingPolicy {
    return this.props.gradingPolicy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /** Check if a lesson-level quiz (has lessonId) */
  get isLessonQuiz(): boolean {
    return this.props.type === AssessmentType.QUIZ && !!this.props.lessonId;
  }

  /** Check if a course-level exam (no lessonId) */
  get isCourseExam(): boolean {
    return this.props.type === AssessmentType.EXAM && !this.props.lessonId;
  }

  canStudentAttempt(currentAttemptCount: number): boolean {
    if (!this.props.maxAttempts) return true;
    return currentAttemptCount < this.props.maxAttempts;
  }

  update(
    fields: Partial<
      Omit<
        AssessmentProps,
        'courseId' | 'lessonId' | 'type' | 'createdAt' | 'updatedAt'
      >
    >,
  ): void {
    if (fields.title !== undefined) this.props.title = fields.title;
    if (fields.description !== undefined)
      this.props.description = fields.description;
    if (fields.maxAttempts !== undefined)
      this.props.maxAttempts = fields.maxAttempts;
    if (fields.timeLimit !== undefined) this.props.timeLimit = fields.timeLimit;
    if (fields.isRandomized !== undefined)
      this.props.isRandomized = fields.isRandomized;
    if (fields.shuffleOptions !== undefined)
      this.props.shuffleOptions = fields.shuffleOptions;
    if (fields.antiCheat !== undefined) this.props.antiCheat = fields.antiCheat;
    if (fields.passScore !== undefined) this.props.passScore = fields.passScore;
    if (fields.gradingPolicy !== undefined)
      this.props.gradingPolicy = fields.gradingPolicy;
  }
}
