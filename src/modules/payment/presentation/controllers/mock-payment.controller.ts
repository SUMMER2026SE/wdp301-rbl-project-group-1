import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Logger,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfirmPaymentCommand } from '../../application/commands/confirm-payment/confirm-payment.command';
import { Webhook } from '@payos/node';
import { Public } from '../../../../modules/auth/presentation/decorators/public.decorator';
import { FastifyReply } from 'fastify';

@ApiTags('Mock Payment')
@Controller('payments/mock')
export class MockPaymentController {
  private readonly logger = new Logger(MockPaymentController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Get('checkout')
  @Public()
  @ApiOperation({ summary: 'Mock checkout endpoint for DEV environment' })
  async mockCheckout(
    @Query('orderCode') orderCode: string,
    @Query('amount') amount: string,
    @Query('returnUrl') returnUrl: string,
    @Res() res: FastifyReply,
  ) {
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.NODE_ENV !== 'dev'
    ) {
      throw new NotFoundException(
        'Mock payment is only available in development environment',
      );
    }

    this.logger.log(`Processing mock checkout for orderCode: ${orderCode}`);

    const decodedReturnUrl = decodeURIComponent(returnUrl);

    // Create a mock PayOS webhook body
    const mockWebhookBody: Webhook = {
      code: '00',
      desc: 'success',
      success: true,
      data: {
        orderCode: Number(orderCode),
        amount: Number(amount),
        description: 'Mock Payment',
        accountNumber: '123456789',
        reference: `mock-ref-${Date.now()}`,
        transactionDateTime: new Date().toISOString(),
        currency: 'VND',
        paymentLinkId: 'mock-link',
        code: '00',
        desc: 'success',
        counterAccountBankId: '',
        counterAccountBankName: '',
        counterAccountName: '',
        counterAccountNumber: '',
        virtualAccountName: '',
        virtualAccountNumber: '',
      },
      signature: 'mock-signature',
    };

    try {
      const command = new ConfirmPaymentCommand(mockWebhookBody);
      await this.commandBus.execute(command);
      this.logger.log(
        `Mock payment confirmed successfully, redirecting to ${decodedReturnUrl}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process mock payment: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return res.status(302).redirect(decodedReturnUrl);
  }
}
