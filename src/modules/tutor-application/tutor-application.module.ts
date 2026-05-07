import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ApproveTutorApplicationHandler } from './application/command/approve-tutor-application/approve-tutor-application.handler';
import { RejectTutorApplicationHandler } from './application/command/reject-tutor-application/reject-tutor-application.handler';
import { CreateTutorApplicationHandler } from './application/command/create-tutor-application/create-tutor-application.handler';
import { GetTutorApplicationHandler } from './application/query/get-tutor-application/get-tutor-application.handler';
import { TutorApplicationRepository } from './domain/repositories/tutor-application.repository';
import { PrismaTutorApplicationRepository } from './infrastructure/repositories/tutor-application.repository.impl';
import { TutorApplicationController } from './presentation/controllers/tutor-application.controller';

const CommandHandlers = [
  CreateTutorApplicationHandler,
  ApproveTutorApplicationHandler,
  RejectTutorApplicationHandler,
];
const QueryHandlers = [GetTutorApplicationHandler];

@Module({
  imports: [CqrsModule, UserModule, AuthModule],
  controllers: [TutorApplicationController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: TutorApplicationRepository,
      useClass: PrismaTutorApplicationRepository,
    },
  ],
  exports: [TutorApplicationRepository],
})
export class TutorApplicationModule {}
