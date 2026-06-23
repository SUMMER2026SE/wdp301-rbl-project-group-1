import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { BookingStatus } from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Review } from '../../domain/entities/review.entity';
import {
  BookingReviewData,
  CreateReviewData,
  FindTutorReviewsParams,
  IReviewRepository,
} from '../../domain/repositories/review.repository.interface';

type ReviewRecord = Prisma.ReviewGetPayload<{
  include: {
    student: {
      select: {
        id: true;
        nickname: true;
        avatarUrl: true;
      };
    };
  };
}>;

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBookingById(bookingId: string): Promise<BookingReviewData | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        tutorId: true,
        studentId: true,
        status: true,
      },
    });

    if (!booking) {
      return null;
    }

    return {
      id: booking.id,
      tutorId: booking.tutorId,
      studentId: booking.studentId,
      status: booking.status as BookingStatus,
    };
  }

  async findByBookingAndStudent(
    bookingId: string,
    studentId: string,
  ): Promise<Review | null> {
    const review = await this.prisma.review.findFirst({
      where: {
        bookingId,
        studentId,
      },
      include: {
        student: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
          },
        },
      },
    });

    return review ? this.toDomain(review as ReviewRecord) : null;
  }

  async create(data: CreateReviewData): Promise<Review> {
    const review = await this.prisma.review.create({
      data: {
        bookingId: data.bookingId,
        tutorId: data.tutorId,
        studentId: data.studentId,
        rating: data.rating,
        comment: data.comment ?? null,
      },
      include: {
        student: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.toDomain(review as ReviewRecord);
  }

  async findById(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
          },
        },
      },
    });

    return review ? this.toDomain(review as ReviewRecord) : null;
  }

  async findTutorReviews(
    params: FindTutorReviewsParams,
  ): Promise<QueryResult<Review>> {
    const sortBy = params.sortBy === 'rating' ? 'rating' : 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    const where: Prisma.ReviewWhereInput = {
      tutorId: params.tutorId,
    };

    const skip = (params.page - 1) * params.limit;

    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: params.limit,
        include: {
          student: {
            select: {
              id: true,
              nickname: true,
              avatarUrl: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    const reviews = items.map((item) => this.toDomain(item as ReviewRecord));
    return createQueryResult(reviews, total, { ...params, skip });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.review.deleteMany({
      where: { id },
    });
    return result.count > 0;
  }

  async getTutorRatingStats(
    tutorId: string,
  ): Promise<{ avgRating: number; totalReviews: number }> {
    const aggregate = await this.prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { id: true },
    });

    return {
      avgRating: aggregate._avg.rating ? Number(aggregate._avg.rating) : 0,
      totalReviews: aggregate._count.id,
    };
  }

  async updateTutorRating(
    tutorId: string,
    rating: number,
    reviewCount: number,
  ): Promise<void> {
    await this.prisma.tutor.update({
      where: { id: tutorId },
      data: {
        rating,
        reviewCount,
      },
    });
  }

  private toDomain(record: ReviewRecord): Review {
    return new Review({
      id: record.id,
      bookingId: record.bookingId,
      tutorId: record.tutorId,
      studentId: record.studentId,
      rating: record.rating,
      comment: record.comment,
      createdAt: record.createdAt,
      student: record.student
        ? {
            id: record.student.id,
            nickname: record.student.nickname,
            avatarUrl: record.student.avatarUrl,
          }
        : undefined,
    });
  }
}
