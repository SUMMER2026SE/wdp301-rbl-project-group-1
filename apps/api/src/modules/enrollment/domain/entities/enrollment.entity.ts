import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { EnrollmentStatus } from '../../../../shared/domain/enums/enums';

export interface EnrollmentProps {
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
}

export class Enrollment extends AggregateRoot<string> {
  private props: EnrollmentProps;

  private constructor(id: string, props: EnrollmentProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: EnrollmentProps): Enrollment {
    return new Enrollment(id, props);
  }

  get studentId(): string {
    return this.props.studentId;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get status(): EnrollmentStatus {
    return this.props.status;
  }

  get enrolledAt(): Date {
    return this.props.enrolledAt;
  }
}
