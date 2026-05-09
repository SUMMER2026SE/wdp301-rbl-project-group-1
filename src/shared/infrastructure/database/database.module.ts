import { Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongoose.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [MongoModule, PrismaModule, RedisModule],
  exports: [MongoModule, PrismaModule, RedisModule],
})
export class DatabaseModule {}
