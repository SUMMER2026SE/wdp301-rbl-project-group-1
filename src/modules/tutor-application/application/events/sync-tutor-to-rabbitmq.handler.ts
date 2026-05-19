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
    // Fetch tutor and user info to get the name and metadata
    const user = await this.prisma.user.findUnique({
      where: { id: event.tutorId },
      include: {
        tutor: {
          include: {
            subjects: { include: { subject: true } },
            grades: { include: { grade: true } },
          },
        },
        profile: true,
      },
    });

    if (!user || !user.tutor) return;

    const subjectSlugs = user.tutor.subjects.map((s) => s.subject.slug);
    const gradeSlugs = user.tutor.grades.map((g) => g.grade.slug);

    await this.messageBroker.publishEvent(EVENTS.TUTOR_CREATED, {
      id: user.id, // Tutor ID is same as User ID
      name: user.profile?.nickname || user.email,
      specialization: user.tutor.specialization,
      experience: user.tutor.experience,
      education: user.tutor.education,
      pricePerHour: user.tutor.pricePerHour
        ? Number(user.tutor.pricePerHour)
        : null,
      subjectSlugs,
      gradeSlugs,
    });
  }
}
