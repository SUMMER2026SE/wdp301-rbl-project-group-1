import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { EntityNotFoundException } from '../../../../../shared/domain/exceptions/domain-exception';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { ChangeCourseStatusCommand } from './change-course-status.command';
import { ChangeCourseStatusResult } from './change-course-status.result';

@CommandHandler(ChangeCourseStatusCommand)
export class ChangeCourseStatusCommandHandler
  implements
    ICommandHandler<ChangeCourseStatusCommand>,
    ICommand<ChangeCourseStatusCommand, ChangeCourseStatusResult>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    command: ChangeCourseStatusCommand,
  ): Promise<ChangeCourseStatusResult> {
    const course = await this.courseRepository.findById(command.courseId);

    if (!course) {
      throw new EntityNotFoundException('Course', command.courseId);
    }

    if (course.tutorId !== command.tutorId) {
      throw new EntityNotFoundException('Course', command.courseId);
    }

    course.changeStatus(command.status);
    const updatedCourse = await this.courseRepository.update(course);

    return new ChangeCourseStatusResult(updatedCourse.id);
  }
}
