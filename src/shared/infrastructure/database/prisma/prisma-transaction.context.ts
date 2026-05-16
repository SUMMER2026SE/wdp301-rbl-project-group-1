import { AsyncLocalStorage } from 'async_hooks';
import { PrismaClient } from '../../../../../generated/prisma/client';

type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

const storage = new AsyncLocalStorage<PrismaTransactionClient>();

export const PrismaTransactionContext = {
  run<T>(txClient: PrismaTransactionClient, fn: () => Promise<T>): Promise<T> {
    return storage.run(txClient, fn);
  },

  getClient(): PrismaTransactionClient | null {
    return storage.getStore() ?? null;
  },
};
