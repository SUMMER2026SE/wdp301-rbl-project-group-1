import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { LessonStatus } from '../../../../shared/domain/enums/enums';

export interface LessonProps {
  courseId: string;
  title: string;
  content?: string | null;
  meetingUrl?: string | null;
  videoUrl?: string | null;
  startTime: Date;
  endTime?: Date | null;
  orderIndex: number;
  status: LessonStatus;
  createdAt: Date;
}

export class Lesson extends AggregateRoot<string> {
  private props: LessonProps;

  private constructor(id: string, props: LessonProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: LessonProps): Lesson {
    return new Lesson(id, props);
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string | null | undefined {
    return this.props.content;
  }

  get meetingUrl(): string | null | undefined {
    return this.props.meetingUrl;
  }

  get videoUrl(): string | null | undefined {
    return this.props.videoUrl;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date | null | undefined {
    return this.props.endTime;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  get status(): LessonStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  update(fields: Partial<Omit<LessonProps, 'courseId' | 'createdAt'>>): void {
    if (fields.title !== undefined) this.props.title = fields.title;
    if (fields.content !== undefined) this.props.content = fields.content;
    if (fields.meetingUrl !== undefined) this.props.meetingUrl = fields.meetingUrl;
    if (fields.videoUrl !== undefined) this.props.videoUrl = fields.videoUrl;
    if (fields.startTime !== undefined) this.props.startTime = fields.startTime;
    if (fields.endTime !== undefined) this.props.endTime = fields.endTime;
    if (fields.orderIndex !== undefined) this.props.orderIndex = fields.orderIndex;
    if (fields.status !== undefined) this.props.status = fields.status;
  }
}
