import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateScheduleAvailabilityHandler } from './application/commands/update-schedule-availability/update-schedule-availability.handler';
import { GetScheduleAvailabilityHandler } from './application/queries/get-schedule-availability/get-schedule-availability.handler';
import { IScheduleAvailabilityRepository } from './domain/repositories/schedule-availability.repository.interface';
import { PrismaScheduleAvailabilityRepository } from './infrastructure/repositories/schedule-availability.repository.impl';
import { ScheduleAvailabilityController } from './presentation/controllers/schedule-availability.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ScheduleAvailabilityController],
  providers: [
    GetScheduleAvailabilityHandler,
    UpdateScheduleAvailabilityHandler,
    {
      provide: IScheduleAvailabilityRepository,
      useClass: PrismaScheduleAvailabilityRepository,
    },
  ],
})
export class ScheduleAvailabilityModule {}
