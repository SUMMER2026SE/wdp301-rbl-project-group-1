import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentController } from './presentation/controllers/payment.controller';
import { WebhookController } from './presentation/controllers/webhook.controller';
import { CreatePaymentHandler } from './application/commands/create-payment/create-payment.handler';
import { ConfirmPaymentHandler } from './application/commands/confirm-payment/confirm-payment.handler';
import { PrismaPaymentRepository } from './infrastructure/repositories/payment.repository';
import { PayosGateway } from './infrastructure/gateways/payos/payos.gateway';
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
    useClass: PayosGateway,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [PaymentController, WebhookController],
  providers: [...CommandHandlers, ...Repositories, ...Gateways],
  exports: [...Repositories],
})
export class PaymentModule {}
