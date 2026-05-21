import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { CourseStatus } from '../../../../../shared/domain/enums/enums';
import { Course } from '../../../domain/entities/course.entity';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { CourseLevel } from '../../../domain/value-objects/course-level';
import { CreateCourseCommand } from './create-course.command';
import { CreateCourseResult } from './create-course.result';

import { EventBus } from '@nestjs/cqrs';
import { CourseCreatedDomainEvent } from '../../../domain/events/course-created.domain-event';

@CommandHandler(CreateCourseCommand)
export class CreateCourseCommandHandler
  implements
    ICommandHandler<CreateCourseCommand>,
    ICommand<CreateCourseCommand, CreateCourseResult>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateCourseCommand): Promise<CreateCourseResult> {
    const courseLevel = CourseLevel.create(command.level);
    const id = randomUUID();

    const course = Course.create(id, {
      tutorId: command.tutorId,
      title: command.title,
      description: command.description,
      price: command.price,
      subjectId: command.subjectId,
      gradeId: command.gradeId,
      level: courseLevel,
      status: CourseStatus.DRAFT,
      createdAt: new Date(),
    });

    const savedCourse = await this.courseRepository.create(course);

    this.eventBus.publish(new CourseCreatedDomainEvent(savedCourse.id));

    return new CreateCourseResult(savedCourse.id);
  }
}
