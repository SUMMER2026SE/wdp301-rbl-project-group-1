import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { CourseUpdatedDomainEvent } from '../../domain/events/course-updated.domain-event';
import { EVENTS } from '../../../../shared/application/constants/events.constants';

@EventsHandler(CourseUpdatedDomainEvent)
export class SyncCourseUpdateToRabbitMqHandler implements IEventHandler<CourseUpdatedDomainEvent> {
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly prisma: PrismaService,
  ) {}

  async handle(event: CourseUpdatedDomainEvent) {
    const course = await this.prisma.course.findUnique({
      where: { id: event.courseId },
      include: {
        subject: true,
        grade: true,
      },
    });

    if (!course) return;

    await this.messageBroker.publishEvent(EVENTS.COURSE_UPDATED, {
      id: course.id,
      title: course.title,
      thumbnailUrl: null,
      tutorId: course.tutorId,
      subjectSlug: course.subject?.slug,
      gradeSlug: course.grade?.slug,
      level: course.level,
      price: Number(course.price),
    });
  }
}
