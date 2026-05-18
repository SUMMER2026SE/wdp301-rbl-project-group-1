import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/modules/auth/presentation/decorators/public.decorator';
import { RabbitmqService } from 'src/shared/infrastructure/messaging/rabbitmq/rabbitmq.service';
import { PrismaHealthIndicator } from './prisma.health';
import { RedisHealthIndicator } from './redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private prismaDb: PrismaHealthIndicator,
    private redisDb: RedisHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
    private rabbitmqService: RabbitmqService,
  ) {}

  @Public()
  @Get('test-rabbitmq')
  async testRabbitMQ() {
    await this.rabbitmqService.publishEvent('enrollment_created', {
      studentId: 'user_123',
      courseId: 'course_456',
      message: 'Hello from NestJS!',
      timestamp: new Date().toISOString(),
    });
    return { status: 'ok', message: 'Event pushed to RabbitMQ successfully' };
  }

  @Public()
  @Get()
  @HealthCheck()
  check() {
    const rmqUrl = this.configService.get<string>('rabbitmq.url') || '';

    return this.health.check([
      async () => this.mongoose.pingCheck('mongodb'),
      async () => this.prismaDb.pingCheck('prisma'),
      async () => this.redisDb.pingCheck('redis'),
      async () =>
        this.microservice.pingCheck<RmqOptions>('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUrl],
          },
          timeout: 10000,
        }),
    ]);
  }
}
