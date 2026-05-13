import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePaymentDto } from '../schemas/create-payment.dto';
import { CreatePaymentCommand } from '../../application/commands/create-payment/create-payment.command';
import { CreatePaymentResult } from '../../application/commands/create-payment/create-payment.result';

@ApiTags('Payment')
@Controller('payments')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment link' })
  @ApiResponse({ status: 201, description: 'Returns the checkoutUrl' })
  async createPayment(
    @Body() dto: CreatePaymentDto,
  ): Promise<CreatePaymentResult> {
    const command = new CreatePaymentCommand(
      dto.payerUserId,
      dto.referenceType,
      dto.referenceId,
      dto.amount,
      dto.returnUrl,
      dto.cancelUrl,
    );

    return this.commandBus.execute(command);
  }
}
