import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { PaymentConfirmedEvent } from '../../../payment/domain/events/payment-confirmed.event';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { EVENTS } from '../../../../shared/application/constants/events.constants';
import {
  PaymentReferenceType,
  BookingStatus,
  ConversationType,
  ParticipantRole,
} from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';

import { MeetingService } from '../../../meeting/application/services/meeting.service';

@EventsHandler(PaymentConfirmedEvent)
export class BookingPaymentConfirmedHandler implements IEventHandler<PaymentConfirmedEvent> {
  private readonly logger = new Logger(BookingPaymentConfirmedHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly meetingService: MeetingService,
  ) {}

  async handle(event: PaymentConfirmedEvent) {
    if (event.referenceType !== PaymentReferenceType.TUTOR_BOOKING) {
      return;
    }

    this.logger.log(
      `Handling payment confirmed for booking ${event.referenceId}`,
    );

    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: event.referenceId },
        include: { subject: true, tutor: { include: { user: true } } },
      });

      if (!booking) {
        this.logger.error(`Booking not found for ID: ${event.referenceId}`);
        return;
      }

      if (booking.status === (BookingStatus.CONFIRMED as string)) {
        this.logger.warn(`Booking ${event.referenceId} is already confirmed.`);
        return;
      }

      let meetingUrl: string | null = null;
      try {
        const title = `Lớp học: ${booking.subject?.name || 'Khác'} - Gia sư ${booking.tutor?.user?.nickname || 'Edura'}`;
        const meetingResult = await this.meetingService.createMeeting(
          booking.tutorId,
          title,
          booking.startDate || new Date(),
          new Date((booking.startDate || new Date()).getTime() + 60 * 60 * 1000), // 1 hour duration
        );
        meetingUrl = meetingResult.meetingUrl;
        this.logger.log(`Generated meeting URL for booking ${booking.id}: ${meetingUrl}`);
      } catch (e) {
        this.logger.error(
          `Failed to generate meeting URL for booking ${booking.id}: ${e instanceof Error ? e.message : String(e)}`,
        );
      }

      await this.prisma.booking.update({
        where: { id: event.referenceId },
        data: {
          status: BookingStatus.CONFIRMED,
          meetingUrl: meetingUrl,
          sessions: meetingUrl
            ? {
                updateMany: {
                  where: { bookingId: event.referenceId },
                  data: { meetingUrl: meetingUrl },
                },
              }
            : undefined,
        },
      });

      await this.messageBroker.publishEvent(EVENTS.BOOKING_CREATED, {
        userId: booking.studentId,
        tutorId: booking.tutorId,
        bookingId: booking.id,
        subjectSlug: booking.subject?.slug,
      });

      // Auto-create a DIRECT conversation between student and tutor if not exists
      await this.ensureDirectConversation(booking.studentId, booking.tutorId);

      this.logger.log(
        `Booking ${event.referenceId} successfully updated to CONFIRMED`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating booking ${event.referenceId} status: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async ensureDirectConversation(
    studentId: string,
    tutorId: string,
  ): Promise<void> {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          { participants: { some: { userId: studentId } } },
          { participants: { some: { userId: tutorId } } },
        ],
      },
    });

    if (existing) {
      this.logger.log(
        `Direct conversation already exists between student ${studentId} and tutor ${tutorId}`,
      );
      return;
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        participants: {
          create: [
            { userId: studentId, role: ParticipantRole.MEMBER },
            { userId: tutorId, role: ParticipantRole.MEMBER },
          ],
        },
      },
    });

    this.logger.log(
      `Auto-created direct conversation ${conversation.id} between student ${studentId} and tutor ${tutorId}`,
    );
  }
}
