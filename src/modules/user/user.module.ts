import { Module } from '@nestjs/common';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/repositories/user.repository.impl';

@Module({
  providers: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserModule {}
