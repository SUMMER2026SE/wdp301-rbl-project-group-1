import {
  PaymentReferenceType,
  PaymentStatus,
} from 'src/shared/domain/enums/enums';

export class PaymentEntity {
  constructor(
    public readonly id: string,
    public readonly payerUserId: string,
    public readonly referenceType: PaymentReferenceType,
    public readonly referenceId: string,
    public readonly amount: number,
    public status: PaymentStatus,
    public orderCode: number,
    public checkoutUrl: string | null = null,
    public transactionId: string | null = null,
    public paymentMethod: string | null = null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public markAsPaid(transactionId: string): void {
    this.status = PaymentStatus.PAID;
    this.transactionId = transactionId;
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
  }

  public setCheckoutUrl(url: string): void {
    this.checkoutUrl = url;
    this.updatedAt = new Date();
  }
}
