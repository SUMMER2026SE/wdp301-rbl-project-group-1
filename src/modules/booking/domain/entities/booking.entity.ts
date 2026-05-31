import {
  BookingStatus,
  PaymentStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';

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
  price: number | null;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
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
  readonly price: number | null;
  readonly paymentStatus: PaymentStatus;
  readonly createdAt: Date;
  updatedAt: Date;

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
    this.price = props.price;
    this.paymentStatus = props.paymentStatus;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
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
