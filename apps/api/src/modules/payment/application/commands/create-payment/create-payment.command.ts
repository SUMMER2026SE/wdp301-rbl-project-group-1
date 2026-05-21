import { PaymentReferenceType } from 'src/shared/domain/enums/enums';

export class CreatePaymentCommand {
  constructor(
    public readonly payerUserId: string,
    public readonly referenceType: PaymentReferenceType,
    public readonly referenceId: string,
    public readonly amount: number,
    public readonly returnUrl: string,
    public readonly cancelUrl: string,
  ) {}
}
