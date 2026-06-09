import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EVENTS } from '../../../../shared/application/constants/events.constants';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { UserCreatedDomainEvent } from '../../../user/domain/events/user-created.domain-event';

@EventsHandler(UserCreatedDomainEvent)
export class SyncUserToRabbitMqHandler implements IEventHandler<UserCreatedDomainEvent> {
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly prisma: PrismaService,
  ) {}

  async handle(event: UserCreatedDomainEvent) {
    let subjectSlugs: string[] = [];
    let gradeSlugs: string[] = [];

    if (event.role === UserRole.STUDENT) {
      // Student subjects/grades are implicit M:M on User
      const user = await this.prisma.user.findUnique({
        where: { id: event.userId },
        include: {
          subjects: true,
          grades: true,
        },
      });

      if (user) {
        subjectSlugs = user.subjects.map((s) => s.slug);
        gradeSlugs = user.grades.map((g) => g.slug);
      }
    } else if (event.role === UserRole.TUTOR) {
      // Tutor subjects/grades are implicit M:M on Tutor
      const tutor = await this.prisma.tutor.findUnique({
        where: { id: event.userId },
        include: {
          subjects: true,
          grades: true,
        },
      });

      if (tutor) {
        subjectSlugs = tutor.subjects.map((s) => s.slug);
        gradeSlugs = tutor.grades.map((g) => g.slug);
      }
    }

    await this.messageBroker.publishEvent(EVENTS.USER_CREATED, {
      id: event.userId,
      email: event.email,
      role: event.role,
      name: event.nickname,
      avatarUrl: null,
      subjectSlugs,
      gradeSlugs,
    });
  }
}
