import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { IScheduleAvailabilityRepository } from '../../../domain/repositories/schedule-availability.repository.interface';
import { GetScheduleAvailabilityQuery } from './get-schedule-availability.query';
import { GetScheduleAvailabilityResult } from './get-schedule-availability.result';

@QueryHandler(GetScheduleAvailabilityQuery)
export class GetScheduleAvailabilityHandler
  implements
    IQueryHandler<GetScheduleAvailabilityQuery>,
    IQuery<GetScheduleAvailabilityQuery, GetScheduleAvailabilityResult>
{
  constructor(
    @Inject(IScheduleAvailabilityRepository)
    private readonly availabilityRepository: IScheduleAvailabilityRepository,
  ) {}

  async execute(
    query: GetScheduleAvailabilityQuery,
  ): Promise<GetScheduleAvailabilityResult> {
    const availability = await this.availabilityRepository.findByUserId(
      query.userId,
    );

    return {
      userId: query.userId,
      availability: availability.map((slot) => ({
        id: slot.id ?? '',
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        createdAt: (slot.createdAt ?? new Date(0)).toISOString(),
        updatedAt: (slot.updatedAt ?? new Date(0)).toISOString(),
      })),
    };
  }
}
