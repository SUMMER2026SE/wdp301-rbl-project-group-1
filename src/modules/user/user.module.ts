import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ChangeAvatarHandler } from './application/commands/change-avatar/change-avatar.handler';
import { UpgradeTutorCommandHandler } from './application/commands/upgrade-tutor/upgrade-tutor.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';

import { GetUsersQueryHandler } from './application/queries/get-users/get-users.handler';

import { IProfileRepository } from './domain/repositories/profile.repository.interface';
import { IUserRepository } from './domain/repositories/user.repository.interface';

import { PrismaProfileRepository } from './infrastructure/repositories/profile.repository.impl';
import { PrismaUserRepository } from './infrastructure/repositories/user.repository.impl';

import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    GetUsersQueryHandler,
    UpdateProfileHandler,
    ChangeAvatarHandler,
    UpgradeTutorCommandHandler,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IProfileRepository,
      useClass: PrismaProfileRepository,
    },
  ],
  exports: [IUserRepository, IProfileRepository],
})
export class UserModule {}
