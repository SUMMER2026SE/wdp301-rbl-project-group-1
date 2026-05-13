import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MeetingModule } from '../meeting/meeting.module';
import { CreateLessonCommandHandler } from './application/commands/create-lesson/create-lesson.handler';
import { ILessonMeetingService } from './domain/interfaces/meeting-service.interface';
import { ILessonRepository } from './domain/repositories/lesson.repository.interface';
import { LessonMeetingServiceAdapter } from './infrastructure/adapters/meeting-service.adapter';
import { PrismaLessonRepository } from './infrastructure/repositories/lesson.repository.impl';
import { LessonController } from './presentation/controllers/lesson.controller';

const CommandHandlers = [CreateLessonCommandHandler];

@Module({
  imports: [CqrsModule, MeetingModule],
  controllers: [LessonController],
  providers: [
    ...CommandHandlers,
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
