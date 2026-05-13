import { Webhook, WebhookData } from '@payos/node';

export const IPaymentGateway = Symbol('IPaymentGateway');

export interface CreatePaymentLinkParams {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentGatewayResponse {
  checkoutUrl: string;
  paymentLinkId: string;
}

export interface IPaymentGateway {
  createPaymentLink(
    params: CreatePaymentLinkParams,
  ): Promise<PaymentGatewayResponse>;
  verifyWebhookData(webhookBody: Webhook): Promise<WebhookData>;
}
