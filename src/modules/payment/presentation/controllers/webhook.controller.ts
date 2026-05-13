import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfirmPaymentCommand } from '../../application/commands/confirm-payment/confirm-payment.command';
import { Webhook } from '@payos/node';

@ApiTags('Payment Webhook')
@Controller('payments/webhook')
export class WebhookController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle PayOS webhook' })
  async handleWebhook(@Body() body: Webhook): Promise<void> {
    const command = new ConfirmPaymentCommand(body);
    await this.commandBus.execute(command);
  }
}
