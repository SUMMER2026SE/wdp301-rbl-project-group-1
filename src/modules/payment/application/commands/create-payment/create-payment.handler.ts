import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { CreatePaymentCommand } from './create-payment.command';
import { IPaymentRepository } from '../../../domain/repositories/payment.repository.interface';
import { IPaymentGateway } from '../../../domain/gateways/payment.gateway.interface';
import { PaymentEntity } from '../../../domain/entities/payment.entity';
import { PaymentStatus } from 'src/shared/domain/enums/enums';
import { CreatePaymentResult } from './create-payment.result';

const ALLOWED_DOMAINS = ['localhost:3000', 'app.edura.com'];

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(IPaymentGateway)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  private validateUrl(url: string): void {
    try {
      const parsedUrl = new URL(url);
      if (!ALLOWED_DOMAINS.includes(parsedUrl.host)) {
        throw new BadRequestException(
          `Domain ${parsedUrl.host} is not allowed`,
        );
      }
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('Invalid URL format');
    }
  }

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResult> {
    this.validateUrl(command.returnUrl);
    this.validateUrl(command.cancelUrl);

    const payment = new PaymentEntity(
      '',
      command.payerUserId,
      command.referenceType,
      command.referenceId,
      command.amount,
      PaymentStatus.PENDING,
      0,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    const savedPayment = await this.paymentRepository.create(payment);

    const paymentLinkData = await this.paymentGateway.createPaymentLink({
      orderCode: savedPayment.orderCode,
      amount: savedPayment.amount,
      description: `Payment ${savedPayment.orderCode}`,
      returnUrl: command.returnUrl,
      cancelUrl: command.cancelUrl,
    });

    savedPayment.setCheckoutUrl(paymentLinkData.checkoutUrl);
    await this.paymentRepository.update(savedPayment);

    return new CreatePaymentResult(paymentLinkData.checkoutUrl);
  }
}
