import { Injectable } from '@nestjs/common';
import { IUnitOfWork } from '../../../application/interfaces/unit-of-work';
import { PrismaService } from './prisma.service';
import { PrismaTransactionContext } from './prisma-transaction.context';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  execute<T>(work: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) =>
      PrismaTransactionContext.run(tx, work),
    );
  }
}
