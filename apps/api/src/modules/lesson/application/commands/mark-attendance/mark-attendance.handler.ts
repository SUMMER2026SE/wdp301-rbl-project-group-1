import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { LessonAttendance } from '../../../domain/entities/lesson-attendance.entity';
import { ILessonAttendanceRepository } from '../../../domain/repositories/lesson-attendance.repository.interface';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { MarkAttendanceCommand } from './mark-attendance.command';
import { MarkAttendanceResult } from './mark-attendance.result';

@CommandHandler(MarkAttendanceCommand)
export class MarkAttendanceCommandHandler
  implements
    ICommandHandler<MarkAttendanceCommand>,
    ICommand<MarkAttendanceCommand, MarkAttendanceResult>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
    @Inject(ILessonAttendanceRepository)
    private readonly attendanceRepository: ILessonAttendanceRepository,
  ) {}

  async execute(command: MarkAttendanceCommand): Promise<MarkAttendanceResult> {
    // Verify the lesson exists and belongs to the tutor's course
    const lessonWithDetails = await this.lessonRepository.findByIdWithDetails(
      command.lessonId,
    );

    if (!lessonWithDetails) {
      throw new NotFoundException(
        `Lesson with id ${command.lessonId} not found`,
      );
    }

    if (lessonWithDetails.tutor.id !== command.tutorId) {
      throw new ForbiddenException(
        'You are not authorized to mark attendance for this lesson',
      );
    }

    const now = new Date();
    const entities = command.attendances.map((item) =>
      LessonAttendance.create(randomUUID(), {
        lessonId: command.lessonId,
        studentId: item.studentId,
        status: item.status,
        note: item.note ?? null,
        markedAt: now,
        updatedAt: now,
      }),
    );

    const saved = await this.attendanceRepository.upsertMany(entities);

    return new MarkAttendanceResult(
      saved.map((a) => ({
        id: a.id,
        lessonId: a.lessonId,
        studentId: a.studentId,
        status: a.status,
        note: a.note ?? null,
        markedAt: a.markedAt,
      })),
    );
  }
}
