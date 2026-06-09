import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { UserAvailability } from '../../domain/entities/user-availability.entity';
import {
  IScheduleAvailabilityRepository,
  ScheduleAvailabilitySlotInput,
} from '../../domain/repositories/schedule-availability.repository.interface';

type UserAvailabilityRecord = Prisma.UserAvailabilityGetPayload<object>;

@Injectable()
export class PrismaScheduleAvailabilityRepository implements IScheduleAvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserAvailability[]> {
    const rows = await this.prisma.userAvailability.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return rows.map((row) => this.toDomain(row));
  }

  async replaceForUser(
    userId: string,
    slots: ScheduleAvailabilitySlotInput[],
  ): Promise<UserAvailability[]> {
    await this.prisma.$transaction([
      this.prisma.userAvailability.deleteMany({ where: { userId } }),
      this.prisma.userAvailability.createMany({
        data: slots.map((slot) => ({
          userId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      }),
    ]);

    return this.findByUserId(userId);
  }

  private toDomain(row: UserAvailabilityRecord): UserAvailability {
    return new UserAvailability({
      id: row.id,
      userId: row.userId,
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
