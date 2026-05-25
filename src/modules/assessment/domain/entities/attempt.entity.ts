import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';

export interface AttemptProps {
  assessmentId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date | null;
  score?: number | null;
  isPassed?: boolean | null;
}

export class Attempt extends AggregateRoot<string> {
  private props: AttemptProps;

  private constructor(id: string, props: AttemptProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: AttemptProps): Attempt {
    return new Attempt(id, props);
  }

  get assessmentId(): string {
    return this.props.assessmentId;
  }

  get studentId(): string {
    return this.props.studentId;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date | null | undefined {
    return this.props.endTime;
  }

  get score(): number | null | undefined {
    return this.props.score;
  }

  get isPassed(): boolean | null | undefined {
    return this.props.isPassed;
  }

  get isSubmitted(): boolean {
    return this.props.endTime !== null && this.props.endTime !== undefined;
  }

  submit(score: number, isPassed: boolean): void {
    this.props.endTime = new Date();
    this.props.score = score;
    this.props.isPassed = isPassed;
  }
}
