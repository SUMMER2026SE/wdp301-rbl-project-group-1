import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = new Redis(configService.get('redis.url') as string, {
          tls: {},
          maxRetriesPerRequest: null,
        });
        return redis;
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
