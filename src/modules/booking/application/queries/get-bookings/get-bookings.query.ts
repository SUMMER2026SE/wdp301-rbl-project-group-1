import { FindBookingsParams } from '../../../domain/repositories/booking.repository.interface';

export class GetBookingsQuery {
  constructor(public readonly params: FindBookingsParams) {}
}
