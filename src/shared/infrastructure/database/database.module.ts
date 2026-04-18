import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MongoModule } from './mongo/mongoose.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [MongoModule, PrismaModule, RedisModule, CloudinaryModule],
  exports: [MongoModule, PrismaModule, RedisModule, CloudinaryModule],
})
export class DatabaseModule {}
