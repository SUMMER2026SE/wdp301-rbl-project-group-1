import {
  BookingStatus,
  PaymentStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';

export interface BookingStudentInfo {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
}

export interface BookingTutorInfo {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface BookingSubjectInfo {
  id: string;
  name: string;
  slug: string;
}

export interface BookingScheduleRuleInfo {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export type BookingProps = {
  id: string;
  requestId: string | null;
  studentId: string;
  tutorId: string;
  subjectId: string | null;
  startDate: Date | null;
  totalSessions: number | null;
  mode: TutoringMode;
  status: BookingStatus;
  meetingUrl: string | null;
  address: string | null;
  message: string | null;
  price: number | null;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  student?: BookingStudentInfo;
  tutor?: BookingTutorInfo;
  subject?: BookingSubjectInfo | null;
  scheduleRules?: BookingScheduleRuleInfo[];
};

export class Booking {
  readonly id: string;
  readonly requestId: string | null;
  readonly studentId: string;
  readonly tutorId: string;
  readonly subjectId: string | null;
  readonly startDate: Date | null;
  readonly totalSessions: number | null;
  readonly mode: TutoringMode;
  status: BookingStatus;
  readonly meetingUrl: string | null;
  readonly address: string | null;
  readonly message: string | null;
  readonly price: number | null;
  readonly paymentStatus: PaymentStatus;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly student?: BookingStudentInfo;
  readonly tutor?: BookingTutorInfo;
  readonly subject?: BookingSubjectInfo | null;
  readonly scheduleRules?: BookingScheduleRuleInfo[];

  constructor(props: BookingProps) {
    this.id = props.id;
    this.requestId = props.requestId;
    this.studentId = props.studentId;
    this.tutorId = props.tutorId;
    this.subjectId = props.subjectId;
    this.startDate = props.startDate;
    this.totalSessions = props.totalSessions;
    this.mode = props.mode;
    this.status = props.status;
    this.meetingUrl = props.meetingUrl;
    this.address = props.address;
    this.message = props.message;
    this.price = props.price;
    this.paymentStatus = props.paymentStatus;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.student = props.student;
    this.tutor = props.tutor;
    this.subject = props.subject;
    this.scheduleRules = props.scheduleRules;
  }

  accept(): void {
    this.status = BookingStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  reject(): void {
    this.status = BookingStatus.CANCELLED;
    this.updatedAt = new Date();
  }
}
