import { SetMetadata } from '@nestjs/common';
import { RATE_LIMIT_KEY } from './decorator.constants';

export const RateLimit = (limit: number, ttl: number) =>
  SetMetadata(RATE_LIMIT_KEY, { limit, ttl });
