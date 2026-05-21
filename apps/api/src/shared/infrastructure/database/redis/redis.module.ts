import { Global, Module } from '@nestjs/common';
import { CACHE_SERVICE } from 'src/shared/application/constants/cache.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: CACHE_SERVICE,
      useClass: RedisService,
    },
  ],
  exports: [CACHE_SERVICE],
})
export class RedisModule {}
