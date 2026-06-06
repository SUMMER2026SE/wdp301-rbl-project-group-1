import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  BidStatus,
  RequestStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetTutorRequestQuery } from './get-tutor-request.query';
import {
  GetTutorRequestResult,
  TutorBidResultData,
} from './get-tutor-request.result';

@QueryHandler(GetTutorRequestQuery)
export class GetTutorRequestQueryHandler
  implements
    IQueryHandler<GetTutorRequestQuery>,
    IQuery<GetTutorRequestQuery, GetTutorRequestResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetTutorRequestQuery): Promise<GetTutorRequestResult> {
    const request = await this.prisma.tutorRequest.findUnique({
      where: { id: query.id },
      include: {
        subject: true,
        grade: true,
        bids: {
          include: {
            tutor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(
        `Tutor request with id ${query.id} not found`,
      );
    }

    const bids = request.bids.map(
      (bid) =>
        new TutorBidResultData(
          bid.id,
          bid.requestId,
          bid.tutorId,
          bid.proposedPrice,
          bid.message,
          bid.status as BidStatus,
          bid.createdAt,
          bid.updatedAt,
          {
            name: bid.tutor.user.nickname,
            avatarUrl: bid.tutor.user.avatarUrl,
            rating: bid.tutor.rating,
            reviewCount: bid.tutor.reviewCount,
          },
        ),
    );

    return new GetTutorRequestResult(
      request.id,
      request.studentId,
      request.subjectId,
      request.gradeId,
      request.title,
      request.description,
      request.mode as TutoringMode,
      request.budget,
      request.status as RequestStatus,
      request.totalSessions,
      request.createdAt,
      bids,
      request.subject
        ? {
            id: request.subject.id,
            name: request.subject.name,
            slug: request.subject.slug,
          }
        : null,
      request.grade
        ? {
            id: request.grade.id,
            name: request.grade.name,
            slug: request.grade.slug,
            order: request.grade.order,
          }
        : null,
    );
  }
}
