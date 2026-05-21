import { Webhook } from '@payos/node';

export class ConfirmPaymentCommand {
  constructor(public readonly webhookBody: Webhook) {}
}
