import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/repositories/user.repository.impl';
import { GetUsersQueryHandler } from './application/queries/get-users/get-users.handler';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    GetUsersQueryHandler,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserModule {}
