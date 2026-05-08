import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { LessonStatus } from '../../../../../shared/domain/enums/enums';
import { Lesson } from '../../../domain/entities/lesson.entity';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { CreateLessonCommand } from './create-lesson.command';
import { CreateLessonResult } from './create-lesson.result';

@CommandHandler(CreateLessonCommand)
export class CreateLessonCommandHandler
  implements
    ICommandHandler<CreateLessonCommand>,
    ICommand<CreateLessonCommand, CreateLessonResult>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(command: CreateLessonCommand): Promise<CreateLessonResult> {
    const id = randomUUID();

    const lesson = Lesson.create(id, {
      courseId: command.courseId,
      title: command.title,
      content: command.content,
      meetingUrl: command.meetingUrl,
      videoUrl: command.videoUrl,
      startTime: command.startTime,
      endTime: command.endTime,
      orderIndex: command.orderIndex,
      status: command.status ?? LessonStatus.SCHEDULED,
      createdAt: new Date(),
    });

    const saved = await this.lessonRepository.create(lesson);

    return new CreateLessonResult(saved.id);
  }
}
