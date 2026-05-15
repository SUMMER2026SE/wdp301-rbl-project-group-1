import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MeetingModule } from '../meeting/meeting.module';
import { CreateLessonCommandHandler } from './application/commands/create-lesson/create-lesson.handler';
import { UpdateLessonCommandHandler } from './application/commands/update-lesson/update-lesson.handler';
import { GetLessonByIdQueryHandler } from './application/queries/get-lesson-by-id/get-lesson-by-id.handler';
import { GetLessonDetailsQueryHandler } from './application/queries/get-lesson-details/get-lesson-details.handler';
import { GetLessonsByCourseQueryHandler } from './application/queries/get-lessons-by-course/get-lessons-by-course.handler';
import { ILessonMeetingService } from './domain/interfaces/meeting-service.interface';
import { ILessonRepository } from './domain/repositories/lesson.repository.interface';
import { LessonMeetingServiceAdapter } from './infrastructure/adapters/meeting-service.adapter';
import { PrismaLessonRepository } from './infrastructure/repositories/lesson.repository.impl';
import { LessonController } from './presentation/controllers/lesson.controller';

const CommandHandlers = [CreateLessonCommandHandler, UpdateLessonCommandHandler];
const QueryHandlers = [
  GetLessonByIdQueryHandler,
  GetLessonsByCourseQueryHandler,
  GetLessonDetailsQueryHandler,
];

@Module({
  imports: [CqrsModule, MeetingModule],
  controllers: [LessonController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: ILessonRepository,
      useClass: PrismaLessonRepository,
    },
    {
      provide: ILessonMeetingService,
      useClass: LessonMeetingServiceAdapter,
    },
  ],
  exports: [ILessonRepository],
})
export class LessonModule {}
