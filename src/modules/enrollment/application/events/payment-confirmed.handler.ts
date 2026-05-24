import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { PaymentConfirmedEvent } from '../../../payment/domain/events/payment-confirmed.event';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import {
  PaymentReferenceType,
  EnrollmentStatus,
} from '../../../../shared/domain/enums/enums';

@EventsHandler(PaymentConfirmedEvent)
export class PaymentConfirmedHandler implements IEventHandler<PaymentConfirmedEvent> {
  private readonly logger = new Logger(PaymentConfirmedHandler.name);

  constructor(
    @Inject(IEnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async handle(event: PaymentConfirmedEvent) {
    if (event.referenceType !== PaymentReferenceType.COURSE_ENROLLMENT) {
      return;
    }

    this.logger.log(
      `Handling PaymentConfirmedEvent for enrollment ${event.referenceId}`,
    );

    const enrollment = await this.enrollmentRepository.findById(
      event.referenceId,
    );

    if (!enrollment) {
      this.logger.warn(`Enrollment ${event.referenceId} not found`);
      return;
    }

    if (enrollment.status === EnrollmentStatus.ACTIVE) {
      this.logger.log(`Enrollment ${event.referenceId} is already ACTIVE`);
      return;
    }

    enrollment.changeStatus(EnrollmentStatus.ACTIVE);
    await this.enrollmentRepository.update(enrollment);

    this.logger.log(`Successfully activated enrollment ${event.referenceId}`);
  }
}
