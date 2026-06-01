import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  BidStatus,
  RequestStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { TutorBid } from '../../domain/entities/tutor-bid.entity';
import { TutorRequest } from '../../domain/entities/tutor-request.entity';
import {
  AcceptedTutorBid,
  AcceptTutorBidData,
  CreateTutorRequestData,
  ITutorRequestRepository,
  SetTutorBidData,
} from '../../domain/repositories/tutor-request.repository.interface';

type TutorRequestRecord = Prisma.TutorRequestGetPayload<object>;
type TutorBidRecord = Prisma.TutorBidGetPayload<object>;

@Injectable()
export class PrismaTutorRequestRepository implements ITutorRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(data: CreateTutorRequestData): Promise<TutorRequest> {
    const request = await this.prisma.tutorRequest.create({
      data: {
        studentId: data.studentId,
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        mode: data.mode,
        budget: data.budget,
        scheduleRules: data.scheduleRules?.length
          ? {
              create: data.scheduleRules.map((rule) => ({
                dayOfWeek: rule.dayOfWeek,
                startTime: rule.startTime,
                endTime: rule.endTime,
              })),
            }
          : undefined,
      },
    });

    return this.toRequestDomain(request);
  }

  async findOpenRequestById(id: string): Promise<TutorRequest | null> {
    const request = await this.prisma.tutorRequest.findFirst({
      where: { id, status: RequestStatus.OPEN },
    });

    return request ? this.toRequestDomain(request) : null;
  }

  async findById(id: string): Promise<TutorRequest | null> {
    const request = await this.prisma.tutorRequest.findUnique({
      where: { id },
    });

    return request ? this.toRequestDomain(request) : null;
  }

  async setBid(data: SetTutorBidData): Promise<TutorBid> {
    const bid = await this.prisma.tutorBid.upsert({
      where: {
        requestId_tutorId: {
          requestId: data.requestId,
          tutorId: data.tutorId,
        },
      },
      create: {
        requestId: data.requestId,
        tutorId: data.tutorId,
        proposedPrice: data.proposedPrice,
        message: data.message,
      },
      update: {
        proposedPrice: data.proposedPrice,
        message: data.message,
        status: BidStatus.PENDING,
      },
    });

    return this.toBidDomain(bid);
  }

  async acceptBid(data: AcceptTutorBidData): Promise<AcceptedTutorBid | null> {
    return this.prisma.$transaction(async (tx) => {
      const bid = await tx.tutorBid.findFirst({
        where: {
          id: data.bidId,
          requestId: data.requestId,
          status: BidStatus.PENDING,
          request: {
            studentId: data.studentId,
            status: RequestStatus.OPEN,
          },
        },
      });

      if (!bid) {
        return null;
      }

      await tx.tutorRequest.update({
        where: { id: data.requestId },
        data: { status: RequestStatus.CLOSED },
      });

      await tx.tutorBid.updateMany({
        where: {
          requestId: data.requestId,
          id: { not: data.bidId },
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      });

      const acceptedBid = await tx.tutorBid.update({
        where: { id: data.bidId },
        data: { status: BidStatus.ACCEPTED },
      });

      return {
        bid: this.toBidDomain(acceptedBid),
        requestStatus: RequestStatus.CLOSED,
      };
    });
  }

  private toRequestDomain(record: TutorRequestRecord): TutorRequest {
    return new TutorRequest({
      id: record.id,
      studentId: record.studentId,
      subjectId: record.subjectId,
      title: record.title,
      description: record.description,
      mode: record.mode as TutoringMode,
      budget: record.budget,
      status: record.status as RequestStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toBidDomain(record: TutorBidRecord): TutorBid {
    return new TutorBid({
      id: record.id,
      requestId: record.requestId,
      tutorId: record.tutorId,
      proposedPrice: record.proposedPrice,
      message: record.message,
      status: record.status as BidStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
