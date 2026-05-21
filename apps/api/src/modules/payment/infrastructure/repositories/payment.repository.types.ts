import {
  PaymentReferenceType,
  PaymentStatus,
} from 'src/shared/domain/enums/enums';

export type PrismaPaymentRecord = {
  id: string;
  payerUserId: string;
  referenceType: PaymentReferenceType;
  referenceId: string;
  amount: number;
  status: PaymentStatus;
  orderCode: number;
  checkoutUrl: string | null;
  transactionId: string | null;
  paymentMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentDelegate = {
  create(args: {
    data: Omit<
      PrismaPaymentRecord,
      'id' | 'createdAt' | 'updatedAt' | 'orderCode'
    >;
  }): Promise<PrismaPaymentRecord>;
  findUnique(args: {
    where: { id?: string; orderCode?: number };
  }): Promise<PrismaPaymentRecord | null>;
  update(args: {
    where: { id: string };
    data: Partial<PrismaPaymentRecord>;
  }): Promise<PrismaPaymentRecord>;
};
