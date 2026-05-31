import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  BookingStatus,
  PaymentStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Booking } from '../../domain/entities/booking.entity';
import { IBookingRepository } from '../../domain/repositories/booking.repository.interface';

type BookingRecord = Prisma.BookingGetPayload<object>;

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    return booking ? this.toDomain(booking) : null;
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
      price: record.price,
      paymentStatus: record.paymentStatus as PaymentStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
