import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CourseModule } from '../course/course.module';
import { EnrollCourseCommandHandler } from './application/commands/enroll-course/enroll-course.handler';
import { IEnrollmentRepository } from './domain/repositories/enrollment.repository.interface';
import { PrismaEnrollmentRepository } from './infrastructure/repositories/enrollment.repository.impl';
import { EnrollmentController } from './presentation/controllers/enrollment.controller';

import { SyncEnrollmentToRabbitMqHandler } from './application/events/sync-enrollment-to-rabbitmq.handler';

const CommandHandlers = [EnrollCourseCommandHandler];
const EventHandlers = [SyncEnrollmentToRabbitMqHandler];

@Module({
  imports: [CqrsModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    {
      provide: IEnrollmentRepository,
      useClass: PrismaEnrollmentRepository,
    },
  ],
  exports: [IEnrollmentRepository],
})
export class EnrollmentModule {}
