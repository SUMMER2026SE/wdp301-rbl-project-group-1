import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IMessageBroker } from '../../../../../shared/application/interfaces/message-broker.interface';
import { EVENTS } from '../../../../../shared/application/constants/events.constants';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { UserRole } from '../../../../../shared/domain/enums/enums';
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
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: UpdateScheduleAvailabilityCommand,
  ): Promise<UpdateScheduleAvailabilityResult> {
    this.validateNoDuplicateSlots(command.availability);

    const availability = await this.availabilityRepository.replaceForUser(
      command.userId,
      command.availability,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: command.userId },
      select: { role: true },
    });

    if (user?.role === UserRole.TUTOR) {
      await this.messageBroker.publishEvent(EVENTS.TUTOR_UPDATED, {
        id: command.userId,
        availabilitySlots: availability.map((slot) => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      });
    }

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
