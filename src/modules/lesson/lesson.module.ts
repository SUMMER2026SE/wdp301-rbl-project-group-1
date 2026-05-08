import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateLessonCommandHandler } from './application/commands/create-lesson/create-lesson.handler';
import { ILessonRepository } from './domain/repositories/lesson.repository.interface';
import { PrismaLessonRepository } from './infrastructure/repositories/lesson.repository.impl';
import { LessonController } from './presentation/controllers/lesson.controller';

const CommandHandlers = [CreateLessonCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [LessonController],
  providers: [
    ...CommandHandlers,
    {
      provide: ILessonRepository,
      useClass: PrismaLessonRepository,
    },
  ],
  exports: [ILessonRepository],
})
export class LessonModule {}
