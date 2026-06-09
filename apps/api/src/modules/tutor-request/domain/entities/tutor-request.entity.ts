import {
  RequestStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';

export type ScheduleRuleInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type TutorRequestProps = {
  id: string;
  studentId: string;
  subjectId: string | null;
  gradeId: string | null;
  title: string;
  description: string;
  mode: TutoringMode;
  budget: number | null;
  totalSessions: number | null;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class TutorRequest {
  readonly id: string;
  readonly studentId: string;
  readonly subjectId: string | null;
  readonly gradeId: string | null;
  readonly title: string;
  readonly description: string;
  readonly mode: TutoringMode;
  readonly budget: number | null;
  readonly totalSessions: number | null;
  readonly status: RequestStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: TutorRequestProps) {
    this.id = props.id;
    this.studentId = props.studentId;
    this.subjectId = props.subjectId;
    this.gradeId = props.gradeId;
    this.title = props.title;
    this.description = props.description;
    this.mode = props.mode;
    this.budget = props.budget;
    this.totalSessions = props.totalSessions;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
