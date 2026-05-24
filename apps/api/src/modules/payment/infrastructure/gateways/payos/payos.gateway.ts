import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS, Webhook, WebhookData } from '@payos/node';
import {
  IPaymentGateway,
  CreatePaymentLinkParams,
  PaymentGatewayResponse,
} from '../../../domain/gateways/payment.gateway.interface';

@Injectable()
export class PayosGateway implements IPaymentGateway {
  private readonly payos: PayOS;
  private readonly logger = new Logger(PayosGateway.name);

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYOS_CLIENT_ID');
    const apiKey = this.configService.get<string>('PAYOS_API_KEY');
    const checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY');

    if (!clientId || !apiKey || !checksumKey) {
      this.logger.warn(
        'PayOS credentials are not fully configured in environment variables.',
      );
    }

    this.payos = new PayOS({
      clientId: clientId || 'dummy',
      apiKey: apiKey || 'dummy',
      checksumKey: checksumKey || 'dummy',
    });
  }

  async createPaymentLink(
    params: CreatePaymentLinkParams,
  ): Promise<PaymentGatewayResponse> {
    const body = {
      orderCode: params.orderCode,
      amount: Math.round(params.amount), // PayOS requires integer (VND has no decimal)
      description: params.description.substring(0, 25),
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
    };

    try {
      const paymentLinkData = await this.payos.paymentRequests.create(body);
      return {
        checkoutUrl: paymentLinkData.checkoutUrl,
        paymentLinkId: paymentLinkData.paymentLinkId,
      };
    } catch (error) {
      this.logger.error('Error creating PayOS payment link', error);
      throw error;
    }
  }

  async verifyWebhookData(webhookBody: Webhook): Promise<WebhookData> {
    try {
      return await this.payos.webhooks.verify(webhookBody);
    } catch (error) {
      this.logger.error('Error verifying PayOS webhook data', error);
      throw error;
    }
  }
}
