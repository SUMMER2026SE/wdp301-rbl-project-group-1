import { Global, Module } from '@nestjs/common';
import { IUnitOfWork } from '../../../application/interfaces/unit-of-work';
import { PrismaUnitOfWork } from './prisma-unit-of-work';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: IUnitOfWork,
      useClass: PrismaUnitOfWork,
    },
  ],
  exports: [PrismaService, IUnitOfWork],
})
export class PrismaModule {}
