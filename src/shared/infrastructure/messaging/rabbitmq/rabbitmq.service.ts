import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RABBITMQ_SERVICE } from './rabbitmq.constants';
import { IMessageBroker } from '../../../application/interfaces/message-broker.interface';

@Injectable()
export class RabbitmqService
  implements OnApplicationBootstrap, OnApplicationShutdown, IMessageBroker
{
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(@Inject(RABBITMQ_SERVICE) private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    try {
      await this.client.connect();
      this.logger.log('Successfully connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
    }
  }

  onApplicationShutdown() {
    this.client.close();
    this.logger.log('Closed RabbitMQ connection');
  }

  async publishEvent(pattern: string, data: any): Promise<void> {
    try {
      // using emit for event-based fire-and-forget
      const record = this.client.emit(pattern, data);
      await lastValueFrom(record);
      this.logger.log(`Published event: ${pattern}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${pattern}`, error);
      throw error;
    }
  }

  async sendMessage<TResult = any, TInput = any>(
    pattern: string,
    data: TInput,
  ): Promise<TResult> {
    try {
      const record = this.client.send<TResult, TInput>(pattern, data);
      const result = await lastValueFrom(record);
      this.logger.log(`Sent message: ${pattern}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send message: ${pattern}`, error);
      throw error;
    }
  }
}
