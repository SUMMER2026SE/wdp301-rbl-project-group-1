import { PaymentReferenceType } from 'src/shared/domain/enums/enums';

export class PaymentConfirmedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly payerUserId: string,
    public readonly referenceType: PaymentReferenceType,
    public readonly referenceId: string,
    public readonly amount: number,
  ) {}
}
