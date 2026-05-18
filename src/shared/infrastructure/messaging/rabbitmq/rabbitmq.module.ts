import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RABBITMQ_SERVICE } from './rabbitmq.constants';
import { RabbitmqService } from './rabbitmq.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RABBITMQ_SERVICE,
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('rabbitmq.url');
        if (!url) {
          throw new Error('RabbitMQ URL is not defined in the configuration.');
        }

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [url],
            queue: 'edura_events_queue', // default queue, or you can make it configurable
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    RabbitmqService,
  ],
  exports: [RabbitmqService, RABBITMQ_SERVICE],
})
export class RabbitmqModule {}
