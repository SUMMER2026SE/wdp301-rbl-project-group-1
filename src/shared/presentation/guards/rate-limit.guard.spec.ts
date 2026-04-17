import { HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../infrastructure/database/redis/redis.constants';
import { RATE_LIMIT_KEY } from '../decorators/decorator.constants';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let redisClient: {
    eval: jest.MockedFunction<Redis['eval']>;
  };
  let reflector: {
    getAllAndOverride: jest.MockedFunction<Reflector['getAllAndOverride']>;
  };

  const createContext = () =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          ip: '127.0.0.1',
          method: 'GET',
          originalUrl: '/health',
          headers: {},
        }),
      }),
      getHandler: () => function handler() {},
      getClass: () => class Controller {},
    }) as never;

  beforeEach(async () => {
    redisClient = {
      eval: jest.fn(),
    };

    reflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        {
          provide: REDIS_CLIENT,
          useValue: redisClient,
        },
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    guard = module.get(RateLimitGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses default limit and ttl when route has no metadata', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    redisClient.eval.mockResolvedValue(1 as never);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(RATE_LIMIT_KEY, [
      expect.any(Function),
      expect.any(Function),
    ]);
    expect(redisClient.eval).toHaveBeenCalledWith(
      expect.any(String),
      1,
      'rate:GET:/health:127.0.0.1',
      '60',
    );
  });

  it('uses route metadata limit and ttl when decorator is present', async () => {
    reflector.getAllAndOverride.mockReturnValue({ limit: 2, ttl: 15 });
    redisClient.eval.mockResolvedValue(3 as never);

    await expect(guard.canActivate(createContext())).rejects.toEqual(
      expect.objectContaining({
        status: HttpStatus.TOO_MANY_REQUESTS,
      }),
    );

    expect(redisClient.eval).toHaveBeenCalledWith(
      expect.any(String),
      1,
      'rate:GET:/health:127.0.0.1',
      '15',
    );
  });
});
