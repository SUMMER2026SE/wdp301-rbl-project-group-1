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

    // 2. Hydrate with full data from Prisma (mirrors TutorProfileResult + user identity)
    const tutors = await this.prisma.tutor.findMany({
      where: { id: { in: recommendedIds } },
      include: {
        user: { include: { profile: true } },
        subjects: { include: { subject: true } },
        grades: { include: { grade: true } },
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
        name: t.user.profile?.nickname ?? t.user.email,
        avatarUrl: t.user.profile?.avatarUrl ?? null,
        bio: t.bio ?? null,
        specialization: t.specialization ?? null,
        experience: t.experience ?? null,
        education: t.education ?? null,
        pricePerHour: t.pricePerHour ?? null,
        rating: t.rating,
        reviewCount: t.reviewCount,
        studentCount: t.studentCount,
        subjects: t.subjects.map((s) => ({
          id: s.subject.id,
          name: s.subject.name,
          slug: s.subject.slug,
        })),
        grades: t.grades.map((g) => ({
          id: g.grade.id,
          name: g.grade.name,
          slug: g.grade.slug,
        })),
      });
    }

    return result;
  }
}
