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
