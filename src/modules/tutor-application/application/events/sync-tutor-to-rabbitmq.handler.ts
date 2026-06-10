import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { TutorCreatedDomainEvent } from '../../domain/events/tutor-created.domain-event';
import { EVENTS } from '../../../../shared/application/constants/events.constants';

@EventsHandler(TutorCreatedDomainEvent)
export class SyncTutorToRabbitMqHandler implements IEventHandler<TutorCreatedDomainEvent> {
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly prisma: PrismaService,
  ) {}

  async handle(event: TutorCreatedDomainEvent) {
    // Fetch tutor with implicit M:M subjects/grades + user for nickname
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: event.tutorId },
      include: {
        user: {
          include: {
            availabilities: true,
          },
        },
        subjects: true,
        grades: true,
      },
    });

    if (!tutor) return;

    const subjectSlugs = tutor.subjects.map((s) => s.slug);
    const gradeSlugs = tutor.grades.map((g) => g.slug);
    const availabilitySlots = tutor.user.availabilities.map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    await this.messageBroker.publishEvent(EVENTS.TUTOR_CREATED, {
      id: tutor.id,
      name: tutor.user.nickname || tutor.user.email,
      avatarUrl: tutor.user.avatarUrl,
      specialization: tutor.specialization,
      experience: tutor.experience,
      education: tutor.education,
      pricePerHour: tutor.pricePerHour ? Number(tutor.pricePerHour) : null,
      subjectSlugs,
      gradeSlugs,
      availabilitySlots,
    });
  }
}
