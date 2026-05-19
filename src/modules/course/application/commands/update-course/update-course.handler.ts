import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { EntityNotFoundException } from '../../../../../shared/domain/exceptions/domain-exception';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { CourseLevel } from '../../../domain/value-objects/course-level';
import { CourseUpdatedDomainEvent } from '../../../domain/events/course-updated.domain-event';
import { UpdateCourseCommand } from './update-course.command';
import { UpdateCourseResult } from './update-course.result';

@CommandHandler(UpdateCourseCommand)
export class UpdateCourseCommandHandler
  implements
    ICommandHandler<UpdateCourseCommand>,
    ICommand<UpdateCourseCommand, UpdateCourseResult>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCourseCommand): Promise<UpdateCourseResult> {
    const course = await this.courseRepository.findById(command.courseId);

    if (!course) {
      throw new EntityNotFoundException('Course', command.courseId);
    }

    if (course.tutorId !== command.tutorId) {
      throw new EntityNotFoundException('Course', command.courseId);
    }

    course.update({
      title: command.title,
      description: command.description,
      price: command.price,
      subjectId: command.subjectId,
      gradeId: command.gradeId,
      level: command.level ? CourseLevel.create(command.level) : undefined,
    });

    const updated = await this.courseRepository.update(course);

    void this.eventBus.publish(new CourseUpdatedDomainEvent(updated.id));

    return new UpdateCourseResult(updated.id);
  }
}
