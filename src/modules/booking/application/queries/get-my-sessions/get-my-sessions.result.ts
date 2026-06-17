import { SessionStatus, AttendanceStatus } from '../../../../../shared/domain/enums/enums';

export interface MySessionResultData {
  id: string;
  bookingId: string | null;
  tutorRequestId: string | null;
  title: string | null;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  meetingUrl: string | null;
  notes: string | null;
  order: number | null;
  createdAt: Date;

  // Enriched data
  counterpartName: string;
  subjectName: string;
  subjectId: string;

  attendance?: {
    status: AttendanceStatus;
    notes: string | null;
  };
}
