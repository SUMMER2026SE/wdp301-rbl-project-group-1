import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { AttendanceStatus } from '../../../../shared/domain/enums/enums';

export interface LessonAttendanceProps {
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string | null;
  markedAt: Date;
  updatedAt: Date;
}

export class LessonAttendance extends AggregateRoot<string> {
  private props: LessonAttendanceProps;

  private constructor(id: string, props: LessonAttendanceProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: LessonAttendanceProps): LessonAttendance {
    return new LessonAttendance(id, props);
  }

  get lessonId(): string {
    return this.props.lessonId;
  }

  get studentId(): string {
    return this.props.studentId;
  }

  get status(): AttendanceStatus {
    return this.props.status;
  }

  get note(): string | null | undefined {
    return this.props.note;
  }

  get markedAt(): Date {
    return this.props.markedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(
    fields: Partial<Pick<LessonAttendanceProps, 'status' | 'note'>>,
  ): void {
    if (fields.status !== undefined) this.props.status = fields.status;
    if (fields.note !== undefined) this.props.note = fields.note;
    this.props.updatedAt = new Date();
  }
}
