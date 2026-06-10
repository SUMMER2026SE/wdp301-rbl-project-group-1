import {
  BookingStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { Booking } from '../entities/booking.entity';

export type FindBookingsParams = QueryParams & {
  userId: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status?: BookingStatus | BookingStatus[];
  mode?: TutoringMode;
};

export const IBookingRepository = Symbol('IBookingRepository');

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findAll(params: FindBookingsParams): Promise<QueryResult<Booking>>;
  updateStatus(
    id: string,
    tutorId: string,
    fromStatus: BookingStatus,
    toStatus: BookingStatus,
  ): Promise<Booking | null>;
}
