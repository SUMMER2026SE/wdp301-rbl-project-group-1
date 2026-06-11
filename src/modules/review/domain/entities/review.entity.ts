export interface ReviewStudentInfo {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
}

export type ReviewProps = {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  student?: ReviewStudentInfo;
};

export class Review {
  readonly id: string;
  readonly bookingId: string;
  readonly tutorId: string;
  readonly studentId: string;
  readonly rating: number;
  readonly comment: string | null;
  readonly createdAt: Date;
  readonly student?: ReviewStudentInfo;

  constructor(props: ReviewProps) {
    this.id = props.id;
    this.bookingId = props.bookingId;
    this.tutorId = props.tutorId;
    this.studentId = props.studentId;
    this.rating = props.rating;
    this.comment = props.comment;
    this.createdAt = props.createdAt;
    this.student = props.student;
  }
}
