import { HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_SERVICE } from 'src/shared/application/constants/cache.constants';
import { RATE_LIMIT_KEY } from '../decorators/decorator.constants';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let redisClient: {
    expire: jest.Mock<any, any>;
    multi: jest.Mock<any, any>;
  };
  let multiMock: {
    incr: jest.Mock<any, any>;
    ttl: jest.Mock<any, any>;
    exec: jest.Mock<any, any>;
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
    multiMock = {
      incr: jest.fn().mockReturnThis(),
      ttl: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        [null, 1],
        [null, -1],
      ]),
    };

    redisClient = {
      expire: jest.fn(),
      multi: jest.fn().mockReturnValue(multiMock),
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
    multiMock.exec.mockResolvedValue([
      [null, 1],
      [null, -1],
    ]);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(RATE_LIMIT_KEY, [
      expect.any(Function),
      expect.any(Function),
    ]);
    expect(redisClient.multi).toHaveBeenCalled();
    expect(multiMock.incr).toHaveBeenCalledWith('rate:GET:/health:127.0.0.1');
    expect(multiMock.ttl).toHaveBeenCalledWith('rate:GET:/health:127.0.0.1');
    expect(redisClient.expire).toHaveBeenCalledWith(
      'rate:GET:/health:127.0.0.1',
      60,
    );
  });

  it('uses route metadata limit and ttl when decorator is present', async () => {
    reflector.getAllAndOverride.mockReturnValue({ limit: 2, ttl: 15 });
    multiMock.exec.mockResolvedValue([
      [null, 3],
      [null, 10],
    ]);

    await expect(guard.canActivate(createContext())).rejects.toEqual(
      expect.objectContaining({
        status: HttpStatus.TOO_MANY_REQUESTS,
      }),
    );

    expect(redisClient.multi).toHaveBeenCalled();
    expect(multiMock.incr).toHaveBeenCalledWith('rate:GET:/health:127.0.0.1');
    expect(redisClient.expire).not.toHaveBeenCalled();
  });
});
