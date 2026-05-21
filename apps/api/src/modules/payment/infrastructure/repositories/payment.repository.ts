import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/database/prisma/prisma.service';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import {
  PrismaPaymentRecord,
  PaymentDelegate,
} from './payment.repository.types';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get paymentDelegate(): PaymentDelegate {
    return this.prisma.payment as unknown as PaymentDelegate;
  }

  private mapToEntity(model: PrismaPaymentRecord): PaymentEntity {
    return new PaymentEntity(
      model.id,
      model.payerUserId,
      model.referenceType,
      model.referenceId,
      model.amount,
      model.status,
      model.orderCode,
      model.checkoutUrl,
      model.transactionId,
      model.paymentMethod,
      model.createdAt,
      model.updatedAt,
    );
  }

  private mapToModel(entity: PaymentEntity): PrismaPaymentRecord {
    return {
      id: entity.id,
      payerUserId: entity.payerUserId,
      referenceType: entity.referenceType,
      referenceId: entity.referenceId,
      amount: entity.amount,
      status: entity.status,
      orderCode: entity.orderCode,
      checkoutUrl: entity.checkoutUrl,
      transactionId: entity.transactionId,
      paymentMethod: entity.paymentMethod,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async create(payment: PaymentEntity): Promise<PaymentEntity> {
    const created = await this.paymentDelegate.create({
      data: {
        payerUserId: payment.payerUserId,
        referenceType: payment.referenceType,
        referenceId: payment.referenceId,
        amount: payment.amount,
        status: payment.status,
        checkoutUrl: payment.checkoutUrl,
        transactionId: payment.transactionId,
        paymentMethod: payment.paymentMethod,
      },
    });

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const model = await this.paymentDelegate.findUnique({ where: { id } });
    if (!model) return null;
    return this.mapToEntity(model);
  }

  async findByOrderCode(orderCode: number): Promise<PaymentEntity | null> {
    const model = await this.paymentDelegate.findUnique({
      where: { orderCode },
    });
    if (!model) return null;
    return this.mapToEntity(model);
  }

  async update(payment: PaymentEntity): Promise<PaymentEntity> {
    const updated = await this.paymentDelegate.update({
      where: { id: payment.id },
      data: this.mapToModel(payment),
    });
    return this.mapToEntity(updated);
  }
}
