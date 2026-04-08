import {
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health';

jest.mock('./prisma.health', () => ({
  PrismaHealthIndicator: class PrismaHealthIndicator {},
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

  beforeEach(async () => {
    const mongoosePingCheck = jest.fn() as jest.MockedFunction<
      MongooseHealthIndicator['pingCheck']
    >;
    const prismaPingCheck = jest.fn() as jest.MockedFunction<
      PrismaHealthIndicator['pingCheck']
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
  });
});
