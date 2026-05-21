import { ConfigService } from '@nestjs/config';
import {
  HealthCheckResult,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { IMessageBroker } from 'src/shared/application/interfaces/message-broker.interface';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health';
import { RedisHealthIndicator } from './redis.health';

jest.mock('./prisma.health', () => ({
  PrismaHealthIndicator: class PrismaHealthIndicator {},
}));

jest.mock('./redis.health', () => ({
  RedisHealthIndicator: class RedisHealthIndicator {},
}));

describe('HealthController', () => {
  let controller: HealthController;

  let healthCheckService: {
    check: jest.MockedFunction<HealthCheckService['check']>;
  };
  let mongooseIndicator: {
    pingCheck: jest.MockedFunction<MongooseHealthIndicator['pingCheck']>;
  };
  let prismaIndicator: {
    pingCheck: jest.MockedFunction<PrismaHealthIndicator['pingCheck']>;
  };
  let redisIndicator: {
    pingCheck: jest.MockedFunction<RedisHealthIndicator['pingCheck']>;
  };
  let microserviceIndicator: {
    pingCheck: jest.MockedFunction<MicroserviceHealthIndicator['pingCheck']>;
  };
  let configService: {
    get: jest.MockedFunction<ConfigService['get']>;
  };

  beforeEach(async () => {
    const mongoosePingCheck = jest.fn() as jest.MockedFunction<
      MongooseHealthIndicator['pingCheck']
    >;
    const prismaPingCheck = jest.fn() as jest.MockedFunction<
      PrismaHealthIndicator['pingCheck']
    >;
    const redisPingCheck = jest.fn() as jest.MockedFunction<
      RedisHealthIndicator['pingCheck']
    >;
    const microservicePingCheck = jest.fn() as jest.MockedFunction<
      MicroserviceHealthIndicator['pingCheck']
    >;
    const healthCheck = jest.fn() as jest.MockedFunction<
      HealthCheckService['check']
    >;

    mongooseIndicator = {
      pingCheck: mongoosePingCheck,
    };
    mongooseIndicator.pingCheck.mockResolvedValue({
      mongodb: { status: 'up' },
    });

    prismaIndicator = {
      pingCheck: prismaPingCheck,
    };
    prismaIndicator.pingCheck.mockResolvedValue({ prisma: { status: 'up' } });

    redisIndicator = {
      pingCheck: redisPingCheck,
    };
    redisIndicator.pingCheck.mockResolvedValue({ redis: { status: 'up' } });

    microserviceIndicator = {
      pingCheck: microservicePingCheck,
    };
    microserviceIndicator.pingCheck.mockResolvedValue({
      rabbitmq: { status: 'up' },
    });

    configService = {
      get: jest.fn().mockReturnValue('amqp://localhost:5672'),
    };

    healthCheckService = {
      check: healthCheck,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: healthCheckService,
        },
        {
          provide: MongooseHealthIndicator,
          useValue: mongooseIndicator,
        },
        {
          provide: PrismaHealthIndicator,
          useValue: prismaIndicator,
        },
        {
          provide: RedisHealthIndicator,
          useValue: redisIndicator,
        },
        {
          provide: MicroserviceHealthIndicator,
          useValue: microserviceIndicator,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: IMessageBroker,
          useValue: { publishEvent: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return health check result with ok status', async () => {
    const mockResult: HealthCheckResult = {
      status: 'ok',
      info: {
        mongodb: { status: 'up' },
        prisma: { status: 'up' },
        redis: { status: 'up' },
        rabbitmq: { status: 'up' },
      },
      details: {},
    };

    healthCheckService.check.mockResolvedValue(mockResult);

    const result = await controller.check();

    expect(result).toEqual(mockResult);
    expect(healthCheckService.check).toHaveBeenCalled();
  });
  it('should call health indicators through health check service', async () => {
    const mockResult: HealthCheckResult = {
      status: 'ok',
      info: {
        mongodb: { status: 'up' },
        prisma: { status: 'up' },
        redis: { status: 'up' },
        rabbitmq: { status: 'up' },
      },
      details: {},
    };

    healthCheckService.check.mockImplementation(async (indicators) => {
      await Promise.all(indicators.map((fn) => Promise.resolve(fn())));
      return mockResult;
    });

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(healthCheckService.check).toHaveBeenCalledWith(expect.any(Array));
    expect(mongooseIndicator.pingCheck).toHaveBeenCalledWith('mongodb');
    expect(prismaIndicator.pingCheck).toHaveBeenCalledWith('prisma');
    expect(redisIndicator.pingCheck).toHaveBeenCalledWith('redis');
    expect(microserviceIndicator.pingCheck).toHaveBeenCalledWith(
      'rabbitmq',
      expect.any(Object),
    );
  });
});
