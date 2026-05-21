import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RABBITMQ_SERVICE } from './rabbitmq.constants';
import { RabbitmqService } from './rabbitmq.service';
import { IMessageBroker } from '../../../application/interfaces/message-broker.interface';

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
            queue: 'edura_events_queue',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: IMessageBroker,
      useClass: RabbitmqService,
    },
  ],
  exports: [IMessageBroker, RABBITMQ_SERVICE],
})
export class RabbitmqModule {}
