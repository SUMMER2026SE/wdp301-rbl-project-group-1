import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, BadRequestException, Logger } from '@nestjs/common';
import { ConfirmPaymentCommand } from './confirm-payment.command';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IPaymentGateway } from '../../../domain/gateways/payment.gateway.interface';
import { PaymentConfirmedEvent } from '../../../domain/events/payment-confirmed.event';
import { PaymentStatus } from 'src/shared/domain/enums/enums';
import { ConfirmPaymentResult } from './confirm-payment.result';

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentHandler implements ICommandHandler<ConfirmPaymentCommand> {
  private readonly logger = new Logger(ConfirmPaymentHandler.name);

  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(IPaymentGateway)
    private readonly paymentGateway: IPaymentGateway,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ConfirmPaymentCommand): Promise<ConfirmPaymentResult> {
    try {
      const webhookData = await this.paymentGateway.verifyWebhookData(
        command.webhookBody,
      );

      if (!webhookData || webhookData.code !== '00') {
        this.logger.warn(
          `Invalid or unsuccessful webhook data: ${JSON.stringify(webhookData)}`,
        );
        return new ConfirmPaymentResult(
          false,
          'Invalid webhook signature or code',
        );
      }

      const orderCode = Number(webhookData.orderCode);
      const payment = await this.paymentRepository.findByOrderCode(orderCode);

      if (!payment) {
        this.logger.error(`Payment not found for orderCode: ${orderCode}`);
        return new ConfirmPaymentResult(false, 'Payment not found');
      }

      if (payment.status === PaymentStatus.PAID) {
        return new ConfirmPaymentResult(true, 'Already paid');
      }

      payment.markAsPaid(webhookData.reference || 'unknown');
      await this.paymentRepository.update(payment);

      this.eventBus.publish(
        new PaymentConfirmedEvent(
          payment.id,
          payment.payerUserId,
          payment.referenceType,
          payment.referenceId,
          payment.amount,
        ),
      );

      return new ConfirmPaymentResult(true);
    } catch (error) {
      this.logger.error(
        `Error processing webhook: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadRequestException('Invalid webhook signature or data');
    }
  }
}
