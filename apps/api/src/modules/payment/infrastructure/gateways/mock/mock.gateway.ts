import { Injectable, Logger } from '@nestjs/common';
import { Webhook, WebhookData } from '@payos/node';
import {
  IPaymentGateway,
  CreatePaymentLinkParams,
  PaymentGatewayResponse,
} from '../../../domain/gateways/payment.gateway.interface';

@Injectable()
export class MockPaymentGateway implements IPaymentGateway {
  private readonly logger = new Logger(MockPaymentGateway.name);

  createPaymentLink(
    params: CreatePaymentLinkParams,
  ): Promise<PaymentGatewayResponse> {
    this.logger.log(`Mocking payment link for orderCode: ${params.orderCode}`);

    const port = process.env.PORT || 8080;
    const checkoutUrl = `http://localhost:${port}/api/payments/mock/checkout?orderCode=${params.orderCode}&amount=${params.amount}&returnUrl=${encodeURIComponent(params.returnUrl)}`;

    return Promise.resolve({
      checkoutUrl,
      paymentLinkId: `mock-link-${Date.now()}`,
    });
  }

  verifyWebhookData(webhookBody: Webhook): Promise<WebhookData> {
    this.logger.log(
      `Mocking webhook verification for orderCode: ${webhookBody.data.orderCode}`,
    );

    // Just return the data from our mocked webhook without verifying signature
    return Promise.resolve(webhookBody.data);
  }
}
