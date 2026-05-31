import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IScheduleAvailabilityRepository } from '../../../domain/repositories/schedule-availability.repository.interface';
import { UpdateScheduleAvailabilityCommand } from './update-schedule-availability.command';
import { UpdateScheduleAvailabilityResult } from './update-schedule-availability.result';

@CommandHandler(UpdateScheduleAvailabilityCommand)
export class UpdateScheduleAvailabilityHandler
  implements
    ICommandHandler<UpdateScheduleAvailabilityCommand>,
    ICommand<
      UpdateScheduleAvailabilityCommand,
      UpdateScheduleAvailabilityResult
    >
{
  constructor(
    @Inject(IScheduleAvailabilityRepository)
    private readonly availabilityRepository: IScheduleAvailabilityRepository,
  ) {}

  async execute(
    command: UpdateScheduleAvailabilityCommand,
  ): Promise<UpdateScheduleAvailabilityResult> {
    this.validateNoDuplicateSlots(command.availability);

    const availability = await this.availabilityRepository.replaceForUser(
      command.userId,
      command.availability,
    );

    return {
      userId: command.userId,
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

  private validateNoDuplicateSlots(
    availability: UpdateScheduleAvailabilityCommand['availability'],
  ) {
    const seen = new Set<string>();

    for (const slot of availability) {
      const key = `${slot.dayOfWeek}:${slot.startTime}:${slot.endTime}`;
      if (seen.has(key)) {
        throw new BadRequestException('Duplicate availability slot');
      }
      seen.add(key);
    }
  }
}
