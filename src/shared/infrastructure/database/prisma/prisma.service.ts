import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('prisma.url');
    const pool = new Pool({ 
      connectionString,
      max: 20,
    });
    const adapter = new PrismaPg(
      pool as unknown as ConstructorParameters<typeof PrismaPg>[0],
    );

    super({ 
      adapter,
      transactionOptions: {
        maxWait: 15000,
        timeout: 30000,
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
