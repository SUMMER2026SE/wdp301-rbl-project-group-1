import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MeetingModule } from '../meeting/meeting.module';
import { ResourceModule } from '../resource/resource.module';
import { CreateLessonCommandHandler } from './application/commands/create-lesson/create-lesson.handler';
import { MarkAttendanceCommandHandler } from './application/commands/mark-attendance/mark-attendance.handler';
import { UpdateLessonCommandHandler } from './application/commands/update-lesson/update-lesson.handler';
import { GetAttendanceByLessonQueryHandler } from './application/queries/get-attendance-by-lesson/get-attendance-by-lesson.handler';
import { GetLessonByIdQueryHandler } from './application/queries/get-lesson-by-id/get-lesson-by-id.handler';
import { GetLessonDetailsQueryHandler } from './application/queries/get-lesson-details/get-lesson-details.handler';
import { GetLessonsByCourseQueryHandler } from './application/queries/get-lessons-by-course/get-lessons-by-course.handler';
import { GetStudentScheduleQueryHandler } from './application/queries/get-student-schedule/get-student-schedule.handler';
import { GetTutorScheduleQueryHandler } from './application/queries/get-tutor-schedule/get-tutor-schedule.handler';
import { ILessonMeetingService } from './domain/interfaces/meeting-service.interface';
import { ILessonAttendanceRepository } from './domain/repositories/lesson-attendance.repository.interface';
import { ILessonRepository } from './domain/repositories/lesson.repository.interface';
import { LessonMeetingServiceAdapter } from './infrastructure/adapters/meeting-service.adapter';
import { PrismaLessonAttendanceRepository } from './infrastructure/repositories/lesson-attendance.repository.impl';
import { PrismaLessonRepository } from './infrastructure/repositories/lesson.repository.impl';
import { LessonController } from './presentation/controllers/lesson.controller';

const CommandHandlers = [
  CreateLessonCommandHandler,
  UpdateLessonCommandHandler,
  MarkAttendanceCommandHandler,
];
const QueryHandlers = [
  GetLessonByIdQueryHandler,
  GetLessonsByCourseQueryHandler,
  GetLessonDetailsQueryHandler,
  GetAttendanceByLessonQueryHandler,
  GetStudentScheduleQueryHandler,
  GetTutorScheduleQueryHandler,
];

@Module({
  imports: [CqrsModule, MeetingModule, ResourceModule],
  controllers: [LessonController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: ILessonRepository,
      useClass: PrismaLessonRepository,
    },
    {
      provide: ILessonAttendanceRepository,
      useClass: PrismaLessonAttendanceRepository,
    },
    {
      provide: ILessonMeetingService,
      useClass: LessonMeetingServiceAdapter,
    },
  ],
  exports: [ILessonRepository],
})
export class LessonModule {}
