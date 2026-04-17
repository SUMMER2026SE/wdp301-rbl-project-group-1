import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../infrastructure/database/redis/redis.constants';
import { RATE_LIMIT_KEY } from '../decorators/decorator.constants';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private static readonly INCREMENT_SCRIPT = `
    local current = redis.call('INCR', KEYS[1])
    if current == 1 then
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    return current
  `;
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_TTL_SECONDS = 60;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      ip?: string;
      method?: string;
      originalUrl?: string;
      url?: string;
      headers?: Record<string, string | string[] | undefined>;
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

    const current = Number(
      await this.redisClient.eval(
        RateLimitGuard.INCREMENT_SCRIPT,
        1,
        key,
        String(ttlSeconds),
      ),
    );

    if (current > limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
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
