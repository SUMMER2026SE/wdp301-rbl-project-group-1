import { BaseEntity } from '../../../../shared/domain/entities/base-entity';

export interface GradebookRecordProps {
  studentId: string;
  courseId: string;
  assessmentId: string;
  finalScore: number;
  isPassed: boolean;
  bestAttemptId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class GradebookRecord extends BaseEntity<string> {
  private props: GradebookRecordProps;

  private constructor(id: string, props: GradebookRecordProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: GradebookRecordProps): GradebookRecord {
    return new GradebookRecord(id, props);
  }

  get studentId(): string {
    return this.props.studentId;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get assessmentId(): string {
    return this.props.assessmentId;
  }

  get finalScore(): number {
    return this.props.finalScore;
  }

  get isPassed(): boolean {
    return this.props.isPassed;
  }

  get bestAttemptId(): string | null | undefined {
    return this.props.bestAttemptId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
