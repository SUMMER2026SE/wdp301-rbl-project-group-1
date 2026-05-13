import { PaymentEntity } from '../entities/payment.entity';

export const IPaymentRepository = Symbol('IPaymentRepository');

export interface IPaymentRepository {
  create(payment: PaymentEntity): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  findByOrderCode(orderCode: number): Promise<PaymentEntity | null>;
  update(payment: PaymentEntity): Promise<PaymentEntity>;
}
