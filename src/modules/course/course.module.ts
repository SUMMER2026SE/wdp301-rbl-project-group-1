import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCourseCommandHandler } from './application/commands/create-course/create-course.handler';
import { UpdateCourseCommandHandler } from './application/commands/update-course/update-course.handler';
import { GetCourseByIdQueryHandler } from './application/queries/get-course-by-id/get-course-by-id.handler';
import { GetCoursesQueryHandler } from './application/queries/get-courses/get-courses.handler';
import { ICourseRepository } from './domain/repositories/course.repository.interface';
import { PrismaCourseRepository } from './infrastructure/repositories/course.repository.impl';
import { CourseController } from './presentation/controllers/course.controller';
import { SyncCourseToRabbitMqHandler } from './application/events/sync-course-to-rabbitmq.handler';
import { SyncCourseUpdateToRabbitMqHandler } from './application/events/sync-course-update-to-rabbitmq.handler';

const CommandHandlers = [
  CreateCourseCommandHandler,
  UpdateCourseCommandHandler,
];
const QueryHandlers = [GetCoursesQueryHandler, GetCourseByIdQueryHandler];
const EventHandlers = [SyncCourseToRabbitMqHandler, SyncCourseUpdateToRabbitMqHandler];

@Module({
  imports: [CqrsModule],
  controllers: [CourseController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: ICourseRepository,
      useClass: PrismaCourseRepository,
    },
  ],
  exports: [ICourseRepository],
})
export class CourseModule {}
