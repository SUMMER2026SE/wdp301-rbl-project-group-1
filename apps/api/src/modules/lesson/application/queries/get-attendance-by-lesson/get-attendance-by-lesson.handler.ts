import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ILessonAttendanceRepository } from '../../../domain/repositories/lesson-attendance.repository.interface';
import { GetAttendanceByLessonQuery } from './get-attendance-by-lesson.query';
import { GetAttendanceByLessonResult } from './get-attendance-by-lesson.result';

@QueryHandler(GetAttendanceByLessonQuery)
export class GetAttendanceByLessonQueryHandler
  implements
    IQueryHandler<GetAttendanceByLessonQuery>,
    IQuery<GetAttendanceByLessonQuery, GetAttendanceByLessonResult>
{
  constructor(
    @Inject(ILessonAttendanceRepository)
    private readonly attendanceRepository: ILessonAttendanceRepository,
  ) {}

  async execute(
    query: GetAttendanceByLessonQuery,
  ): Promise<GetAttendanceByLessonResult> {
    const attendances = await this.attendanceRepository.findByLessonId(
      query.lessonId,
    );

    return new GetAttendanceByLessonResult(
      attendances.map((a) => ({
        id: a.id,
        lessonId: a.lessonId,
        studentId: a.studentId,
        status: a.status,
        note: a.note ?? null,
        markedAt: a.markedAt,
        updatedAt: a.updatedAt,
      })),
    );
  }
}
