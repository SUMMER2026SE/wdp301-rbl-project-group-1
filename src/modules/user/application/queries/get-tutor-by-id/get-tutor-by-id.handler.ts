import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRole as PrismaUserRole } from '../../../../../../generated/prisma/client';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetTutorByIdQuery } from './get-tutor-by-id.query';
import { GetTutorByIdResult } from './get-tutor-by-id.result';

@QueryHandler(GetTutorByIdQuery)
export class GetTutorByIdQueryHandler
  implements
    IQueryHandler<GetTutorByIdQuery>,
    IQuery<GetTutorByIdQuery, GetTutorByIdResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetTutorByIdQuery): Promise<GetTutorByIdResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: query.tutorId, role: PrismaUserRole.TUTOR },
      include: { tutor: true },
    });

    if (!user || !user.tutor) {
      throw new NotFoundException('Tutor not found');
    }

    return {
      id: user.id,
      nickname: user.nickname ?? null,
      avatarUrl: user.avatarUrl ?? null,
      bio: user.tutor.bio,
      specialization: user.tutor.specialization,
      experience: user.tutor.experience,
      education: user.tutor.education,
      pricePerHour: user.tutor.pricePerHour,
      rating: user.tutor.rating,
      reviewCount: user.tutor.reviewCount,
      studentCount: user.tutor.studentCount,
    };
  }
}
