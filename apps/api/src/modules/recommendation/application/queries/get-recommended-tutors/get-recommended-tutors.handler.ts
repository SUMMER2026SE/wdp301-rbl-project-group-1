import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { IAiRecommendationService } from '../../../domain/services/ai-recommendation.service.interface';
import { GetRecommendedTutorsQuery } from './get-recommended-tutors.query';
import { GetRecommendedTutorsResult } from './get-recommended-tutors.result';

@QueryHandler(GetRecommendedTutorsQuery)
@Injectable()
export class GetRecommendedTutorsHandler implements IQueryHandler<GetRecommendedTutorsQuery> {
  constructor(
    @Inject(IAiRecommendationService)
    private readonly aiService: IAiRecommendationService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    query: GetRecommendedTutorsQuery,
  ): Promise<GetRecommendedTutorsResult> {
    const { userId } = query;

    // 1. Get ordered list of IDs from the AI service
    const recommendedIds = await this.aiService.getRecommendedTutorIds(userId);

    if (recommendedIds.length === 0) return [];

    // 2. Hydrate with full data from Prisma (implicit M:M, consolidated user)
    const tutors = await this.prisma.tutor.findMany({
      where: { id: { in: recommendedIds } },
      include: {
        user: true,
        subjects: true,
        grades: true,
      },
    });

    // 3. Build a Map for O(1) lookup, then preserve AI-ranked order
    const tutorMap = new Map(tutors.map((t) => [t.id, t]));

    const result: GetRecommendedTutorsResult = [];
    for (const id of recommendedIds) {
      const t = tutorMap.get(id);
      if (!t) continue;
      result.push({
        id: t.id,
        name: t.user.nickname ?? t.user.email,
        avatarUrl: t.user.avatarUrl ?? null,
        bio: t.bio ?? null,
        specialization: t.specialization ?? null,
        experience: t.experience ?? null,
        education: t.education ?? null,
        pricePerHour: t.pricePerHour ?? null,
        rating: t.rating,
        reviewCount: t.reviewCount,
        studentCount: t.studentCount,
        subjects: t.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
        })),
        grades: t.grades.map((g) => ({
          id: g.id,
          name: g.name,
          slug: g.slug,
        })),
      });
    }

    return result;
  }
}
