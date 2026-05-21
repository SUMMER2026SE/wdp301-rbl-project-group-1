import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ChangeAvatarHandler } from './application/commands/change-avatar/change-avatar.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';
import { UpdateStudentProfileHandler } from './application/commands/update-student-profile/update-student-profile.handler';
import { UpdateTutorProfileHandler } from './application/commands/update-tutor-profile/update-tutor-profile.handler';
import { UpgradeTutorCommandHandler } from './application/commands/upgrade-tutor/upgrade-tutor.handler';

import { GetProfileQueryHandler } from './application/queries/get-profile/get-profile.handler';
import { GetTutorsQueryHandler } from './application/queries/get-tutors/get-tutors.handler';
import { GetUserProfileByIdQueryHandler } from './application/queries/get-user-profile-by-id/get-user-profile-by-id.handler';
import { GetUsersQueryHandler } from './application/queries/get-users/get-users.handler';
import { SyncTutorViewToRabbitMqHandler } from './application/events/sync-tutor-view-to-rabbitmq.handler';

import { IProfileRepository } from './domain/repositories/profile.repository.interface';
import { IStudentRepository } from './domain/repositories/student.repository.interface';
import { ITutorRepository } from './domain/repositories/tutor.repository.interface';
import { IUserIdentityRepository } from './domain/repositories/user-identity.repository.interface';
import { IUserRepository } from './domain/repositories/user.repository.interface';

import { PrismaProfileRepository } from './infrastructure/repositories/profile.repository.impl';
import { PrismaStudentRepository } from './infrastructure/repositories/student.repository.impl';
import { PrismaTutorRepository } from './infrastructure/repositories/tutor.repository.impl';
import { PrismaUserIdentityRepository } from './infrastructure/repositories/user-identity.repository.impl';
import { PrismaUserRepository } from './infrastructure/repositories/user.repository.impl';

import { TutorController } from './presentation/controllers/tutor.controller';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [CqrsModule],
  controllers: [UserController, TutorController],
  providers: [
    GetProfileQueryHandler,
    GetTutorsQueryHandler,
    GetUsersQueryHandler,
    GetUserProfileByIdQueryHandler,
    UpdateProfileHandler,
    ChangeAvatarHandler,
    UpgradeTutorCommandHandler,
    UpdateTutorProfileHandler,
    UpdateStudentProfileHandler,
    SyncTutorViewToRabbitMqHandler,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IProfileRepository,
      useClass: PrismaProfileRepository,
    },
    {
      provide: IUserIdentityRepository,
      useClass: PrismaUserIdentityRepository,
    },
    {
      provide: ITutorRepository,
      useClass: PrismaTutorRepository,
    },
    {
      provide: IStudentRepository,
      useClass: PrismaStudentRepository,
    },
  ],
  exports: [IUserRepository, IProfileRepository, IUserIdentityRepository],
})
export class UserModule {}
