import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  BookingStatus,
  PaymentStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Booking } from '../../domain/entities/booking.entity';
import {
  FindBookingsParams,
  IBookingRepository,
} from '../../domain/repositories/booking.repository.interface';
import { createQueryResult, QueryResult } from '../../../../shared/domain/common/query';

type BookingRecord = Prisma.BookingGetPayload<{
  include: {
    student: true;
    tutor: { include: { user: true } };
    subject: true;
    scheduleRules: true;
  };
}>;

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        tutor: { include: { user: true } },
        subject: true,
        scheduleRules: true,
      },
    });
    return booking ? this.toDomain(booking as BookingRecord) : null;
  }

  async findAll(params: FindBookingsParams): Promise<QueryResult<Booking>> {
    const where: Prisma.BookingWhereInput = {};

    if (params.role === 'STUDENT') {
      where.studentId = params.userId;
    } else if (params.role === 'TUTOR') {
      where.tutorId = params.userId;
    }

    if (params.status) {
      if (Array.isArray(params.status)) {
        where.status = { in: params.status };
      } else {
        where.status = params.status;
      }
    }

    if (params.mode) {
      where.mode = params.mode;
    }

    const orderBy: Prisma.BookingOrderByWithRelationInput = {};
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const skip = (params.page - 1) * params.limit;

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: {
          student: true,
          tutor: { include: { user: true } },
          subject: true,
          scheduleRules: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const bookings = items.map((item) => this.toDomain(item as BookingRecord));

    return createQueryResult(bookings, total, { ...params, skip });
  }

  async updateStatus(
    id: string,
    tutorId: string,
    fromStatus: BookingStatus,
    toStatus: BookingStatus,
  ): Promise<Booking | null> {
    const result = await this.prisma.booking.updateMany({
      where: { id, tutorId, status: fromStatus },
      data: { status: toStatus },
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id);
  }

  private toDomain(record: BookingRecord): Booking {
    return new Booking({
      id: record.id,
      requestId: record.requestId,
      studentId: record.studentId,
      tutorId: record.tutorId,
      subjectId: record.subjectId,
      startDate: record.startDate,
      totalSessions: record.totalSessions,
      mode: record.mode as TutoringMode,
      status: record.status as BookingStatus,
      meetingUrl: record.meetingUrl,
      address: record.address,
      message: record.message,
      price: record.price,
      paymentStatus: record.paymentStatus as PaymentStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      student: record.student
        ? {
            id: record.student.id,
            nickname: record.student.nickname ?? null,
            avatarUrl: record.student.avatarUrl ?? null,
          }
        : undefined,
      tutor: record.tutor
        ? {
            id: record.tutor.id,
            name: record.tutor.user.nickname || 'Gia sư',
            avatarUrl: record.tutor.user.avatarUrl ?? null,
          }
        : undefined,
      subject: record.subject
        ? {
            id: record.subject.id,
            name: record.subject.name,
            slug: record.subject.slug,
          }
        : null,
      scheduleRules: record.scheduleRules
        ? record.scheduleRules.map((rule) => ({
            dayOfWeek: rule.dayOfWeek,
            startTime: rule.startTime,
            endTime: rule.endTime,
          }))
        : undefined,
    });
  }
}
