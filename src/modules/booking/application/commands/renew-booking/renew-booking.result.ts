import {
  BookingStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';

export class RenewBookingResult {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
    public readonly subjectId: string | null,
    public readonly mode: TutoringMode,
    public readonly status: BookingStatus,
    public readonly totalSessions: number,
    public readonly message: string | null,
    public readonly createdAt: string,
  ) {}
}
