import { BookingStatus } from '../../../../../shared/domain/enums/enums';

export class RejectBookingResult {
  constructor(
    public readonly bookingId: string,
    public readonly status: BookingStatus,
  ) {}
}
