import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';

jest.mock('./prisma.health', () => ({
  PrismaHealthIndicator: class PrismaHealthIndicator {},
}));

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockMongooseIndicator = {
    pingCheck: jest.fn(),
  };

  const mockPrismaIndicator = {
    pingCheck: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: MongooseHealthIndicator,
          useValue: mockMongooseIndicator,
        },
        {
          provide: PrismaHealthIndicator,
          useValue: mockPrismaIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return health check result', async () => {
    const mongooseResult = { mongodb: { status: 'up' } };
    const prismaResult = { prisma: { status: 'up' } };

    mockMongooseIndicator.pingCheck.mockResolvedValue(mongooseResult);
    mockPrismaIndicator.pingCheck.mockResolvedValue(prismaResult);

    mockHealthCheckService.check.mockImplementation(
      async (indicators: HealthIndicatorFunction[]) => {
        const results = await Promise.all(
          indicators.map((fn) => Promise.resolve(fn())),
        );
        const info = results.reduce(
          (acc, current) => ({ ...acc, ...current }),
          {},
        );
        return {
          status: 'ok',
          info,
        };
      },
    );

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.info).toEqual({
      mongodb: { status: 'up' },
      prisma: { status: 'up' },
    });
    expect(mockMongooseIndicator.pingCheck).toHaveBeenCalledWith('mongodb');
    expect(mockPrismaIndicator.pingCheck).toHaveBeenCalledWith('prisma');
    expect(mockHealthCheckService.check).toHaveBeenCalled();
  });
});
