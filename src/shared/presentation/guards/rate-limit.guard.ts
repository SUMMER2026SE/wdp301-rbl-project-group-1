import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_SERVICE } from 'src/shared/application/constants/cache.constants';
import { ICache } from 'src/shared/application/interfaces/cache.interface';
import { RedisService } from '../../infrastructure/database/redis/redis.service';
import { RATE_LIMIT_KEY } from '../decorators/decorator.constants';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private static readonly DEFAULT_LIMIT = 100;
  private static readonly DEFAULT_TTL_SECONDS = 60;

  constructor(
    @Inject(CACHE_SERVICE) private readonly cacheService: ICache,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      ip?: string;
      method?: string;
      originalUrl?: string;
      url?: string;
      headers?: Record<string, string[] | undefined>;
      raw?: { url?: string };
    }>();

    const config =
      this.reflector.getAllAndOverride<{ limit?: number; ttl?: number }>(
        RATE_LIMIT_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? {};

    const limit = config.limit ?? RateLimitGuard.DEFAULT_LIMIT;
    const ttlSeconds = config.ttl ?? RateLimitGuard.DEFAULT_TTL_SECONDS;

    const clientIp = this.resolveClientIp(request);
    const routePath = this.resolveRoutePath(request);
    const key = `rate:${request.method ?? 'UNKNOWN'}:${routePath}:${clientIp}`;

    try {
      const current = await (this.cacheService as RedisService)
        .getClient()
        .incr(key);

      if (current === 1) {
        await (this.cacheService as RedisService)
          .getClient()
          .expire(key, ttlSeconds);
      }

      if (current > limit) {
        throw new HttpException(
          'Too many requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // Fail-open: if Redis is unreachable or times out, we allow the request
      // rather than crashing the entire API.
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[RateLimitGuard] Redis error: ${message}`);
    }

    return true;
  }

  private resolveClientIp(request: {
    ip?: string;
    headers?: Record<string, string | string[] | undefined>;
  }): string {
    const forwardedFor = request.headers?.['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
      return forwardedFor.split(',')[0].trim();
    }

    if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
      return forwardedFor[0].split(',')[0].trim();
    }

    return request.ip ?? 'unknown';
  }

  private resolveRoutePath(request: {
    originalUrl?: string;
    url?: string;
    raw?: { url?: string };
  }): string {
    const url = request.originalUrl ?? request.url ?? request.raw?.url ?? '/';

    return url.split('?')[0] ?? '/';
  }
}
