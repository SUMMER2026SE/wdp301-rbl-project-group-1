import { GetBookingsQueryParams } from '../../../presentation/schemas/get-bookings-query.dto';

export class GetBookingsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: 'STUDENT' | 'TUTOR',
    public readonly params: GetBookingsQueryParams,
  ) {}
}
