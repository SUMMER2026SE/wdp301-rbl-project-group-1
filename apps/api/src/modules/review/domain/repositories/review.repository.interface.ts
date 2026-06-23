import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { BookingStatus } from '../../../../shared/domain/enums/enums';
import { Review } from '../entities/review.entity';

export type FindTutorReviewsParams = QueryParams & {
  tutorId: string;
};

export type BookingReviewData = {
  id: string;
  tutorId: string;
  studentId: string;
  status: BookingStatus;
};

export type CreateReviewData = {
  bookingId: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment?: string | null;
};

export const IReviewRepository = Symbol('IReviewRepository');

export interface IReviewRepository {
  findBookingById(bookingId: string): Promise<BookingReviewData | null>;
  findByBookingAndStudent(
    bookingId: string,
    studentId: string,
  ): Promise<Review | null>;
  create(data: CreateReviewData): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findTutorReviews(
    params: FindTutorReviewsParams,
  ): Promise<QueryResult<Review>>;
  deleteById(id: string): Promise<boolean>;
  getTutorRatingStats(
    tutorId: string,
  ): Promise<{ avgRating: number; totalReviews: number }>;
  updateTutorRating(
    tutorId: string,
    rating: number,
    reviewCount: number,
  ): Promise<void>;
}
