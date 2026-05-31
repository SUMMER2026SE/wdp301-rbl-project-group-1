import { BookingStatus } from '../../../../shared/domain/enums/enums';
import { Booking } from '../entities/booking.entity';

export const IBookingRepository = Symbol('IBookingRepository');

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  updateStatus(
    id: string,
    tutorId: string,
    fromStatus: BookingStatus,
    toStatus: BookingStatus,
  ): Promise<Booking | null>;
}
