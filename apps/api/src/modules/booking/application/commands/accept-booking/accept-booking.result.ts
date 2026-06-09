import { BookingStatus } from '../../../../../shared/domain/enums/enums';

export class AcceptBookingResult {
  constructor(
    public readonly bookingId: string,
    public readonly status: BookingStatus,
  ) {}
}
