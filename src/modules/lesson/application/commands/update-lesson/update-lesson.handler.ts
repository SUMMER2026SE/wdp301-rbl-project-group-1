import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { EntityNotFoundException } from '../../../../../shared/domain/exceptions/domain-exception';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { UpdateLessonCommand } from './update-lesson.command';
import { UpdateLessonResult } from './update-lesson.result';

@CommandHandler(UpdateLessonCommand)
export class UpdateLessonCommandHandler
  implements
    ICommandHandler<UpdateLessonCommand>,
    ICommand<UpdateLessonCommand, UpdateLessonResult>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(command: UpdateLessonCommand): Promise<UpdateLessonResult> {
    const lesson = await this.lessonRepository.findById(command.lessonId);

    if (!lesson) {
      throw new EntityNotFoundException('Lesson', command.lessonId);
    }

    lesson.update({
      title: command.title,
      content: command.content,
      meetingUrl: command.meetingUrl,
      videoUrl: command.videoUrl,
      startTime: command.startTime,
      endTime: command.endTime,
      orderIndex: command.orderIndex,
      status: command.status,
    });

    const updated = await this.lessonRepository.update(lesson);
    return new UpdateLessonResult(updated.id);
  }
}
