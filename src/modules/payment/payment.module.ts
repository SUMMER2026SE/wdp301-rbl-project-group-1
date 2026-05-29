import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { PaymentController } from './presentation/controllers/payment.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';
import { MockPaymentController } from './presentation/controllers/mock-payment.controller';
import { CreatePaymentHandler } from './application/commands/create-payment/create-payment.handler';
import { ConfirmPaymentHandler } from './application/commands/confirm-payment/confirm-payment.handler';
import { PrismaPaymentRepository } from './infrastructure/repositories/payment.repository';
import { PayosGateway } from './infrastructure/gateways/payos/payos.gateway';
import { MockPaymentGateway } from './infrastructure/gateways/mock/mock.gateway';
import { IPaymentRepository } from './domain/repositories/payment.repository.interface';
import { IPaymentGateway } from './domain/gateways/payment.gateway.interface';

const CommandHandlers = [CreatePaymentHandler, ConfirmPaymentHandler];

const Repositories = [
  {
    provide: IPaymentRepository,
    useClass: PrismaPaymentRepository,
  },
];

const Gateways = [
  {
    provide: IPaymentGateway,
    useFactory: (configService: ConfigService) => {
      const env = configService.get<string>('NODE_ENV');
      if (env === 'development' || env === 'dev') {
        return new MockPaymentGateway();
      }
      return new PayosGateway(configService);
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [PaymentController, WebhookController, MockPaymentController],
  providers: [...CommandHandlers, ...Repositories, ...Gateways],
  exports: [...Repositories],
})
export class PaymentModule {}
