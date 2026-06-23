import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ChangeAvatarHandler } from './application/commands/change-avatar/change-avatar.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';
import { UpdateStudentProfileHandler } from './application/commands/update-student-profile/update-student-profile.handler';
import { UpdateTutorProfileHandler } from './application/commands/update-tutor-profile/update-tutor-profile.handler';
import { UpgradeTutorCommandHandler } from './application/commands/upgrade-tutor/upgrade-tutor.handler';
import { BanUserHandler } from './application/commands/ban-user/ban-user.handler';
import { UnbanUserHandler } from './application/commands/unban-user/unban-user.handler';
import { GetProfileQueryHandler } from './application/queries/get-profile/get-profile.handler';
import { GetTutorByIdQueryHandler } from './application/queries/get-tutor-by-id/get-tutor-by-id.handler';
import { GetTutorsQueryHandler } from './application/queries/get-tutors/get-tutors.handler';
import { GetUserProfileByIdHandler } from './application/queries/get-user-profile-by-id/get-user-profile-by-id.handler';
import { GetUsersQueryHandler } from './application/queries/get-users/get-users.handler';
import { SyncTutorViewToRabbitMqHandler } from './application/events/sync-tutor-view-to-rabbitmq.handler';

import { ITutorRepository } from './domain/repositories/tutor.repository.interface';
import { IUserIdentityRepository } from './domain/repositories/user-identity.repository.interface';
import { IUserRepository } from './domain/repositories/user.repository.interface';

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
    GetTutorByIdQueryHandler,
    GetTutorsQueryHandler,
    GetUsersQueryHandler,
    GetUserProfileByIdHandler,
    UpdateProfileHandler,
    ChangeAvatarHandler,
    UpgradeTutorCommandHandler,
    UpdateTutorProfileHandler,
    UpdateStudentProfileHandler,
    BanUserHandler,
    UnbanUserHandler,
    SyncTutorViewToRabbitMqHandler,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ITutorRepository,
      useClass: PrismaTutorRepository,
    },
    {
      provide: IUserIdentityRepository,
      useClass: PrismaUserIdentityRepository,
    },
  ],
  exports: [IUserRepository, IUserIdentityRepository],
})
export class UserModule {}
