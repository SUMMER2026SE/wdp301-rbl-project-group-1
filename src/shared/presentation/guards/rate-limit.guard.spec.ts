import { HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_SERVICE } from 'src/shared/application/constants/cache.constants';
import { RATE_LIMIT_KEY } from '../decorators/decorator.constants';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let redisClient: {
    incr: jest.Mock<any, any>;
    expire: jest.Mock<any, any>;
  };
  let cacheService: {
    getClient: jest.Mock<any, any>;
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
      incr: jest.fn(),
      expire: jest.fn(),
    };

    cacheService = {
      getClient: jest.fn().mockReturnValue(redisClient),
    };

    reflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        {
          provide: CACHE_SERVICE,
          useValue: cacheService,
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
    redisClient.incr.mockResolvedValue(1);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(RATE_LIMIT_KEY, [
      expect.any(Function),
      expect.any(Function),
    ]);
    expect(redisClient.incr).toHaveBeenCalledWith('rate:GET:/health:127.0.0.1');
    expect(redisClient.expire).toHaveBeenCalledWith(
      'rate:GET:/health:127.0.0.1',
      60,
    );
  });

  it('uses route metadata limit and ttl when decorator is present', async () => {
    reflector.getAllAndOverride.mockReturnValue({ limit: 2, ttl: 15 });
    redisClient.incr.mockResolvedValue(3);

    await expect(guard.canActivate(createContext())).rejects.toEqual(
      expect.objectContaining({
        status: HttpStatus.TOO_MANY_REQUESTS,
      }),
    );

    expect(redisClient.incr).toHaveBeenCalledWith('rate:GET:/health:127.0.0.1');
    expect(redisClient.expire).not.toHaveBeenCalled();
  });
});
