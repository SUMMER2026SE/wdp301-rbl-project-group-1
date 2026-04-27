import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { CourseStatus } from '../../../../shared/domain/enums/enums';
import { CourseLevel } from '../value-objects/course-level';

export interface CourseProps {
  tutorId: string;
  title: string;
  description?: string | null;
  price?: number | null;
  subjectId: string;
  gradeId: string;
  level: CourseLevel;
  status: CourseStatus;
  createdAt: Date;
}

export class Course extends AggregateRoot<string> {
  private props: CourseProps;

  private constructor(id: string, props: CourseProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: CourseProps): Course {
    return new Course(id, props);
  }

  get tutorId(): string {
    return this.props.tutorId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null | undefined {
    return this.props.description;
  }

  get price(): number | null | undefined {
    return this.props.price;
  }

  get subjectId(): string {
    return this.props.subjectId;
  }

  get gradeId(): string {
    return this.props.gradeId;
  }

  get level(): CourseLevel {
    return this.props.level;
  }

  get status(): CourseStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
