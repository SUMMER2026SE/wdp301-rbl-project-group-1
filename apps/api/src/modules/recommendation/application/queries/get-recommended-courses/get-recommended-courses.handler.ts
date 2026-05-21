import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CourseLevelType } from '../../../../course/domain/value-objects/course-level';
import { CourseStatus } from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { IAiRecommendationService } from '../../../domain/services/ai-recommendation.service.interface';
import { GetRecommendedCoursesQuery } from './get-recommended-courses.query';
import { GetRecommendedCoursesResult } from './get-recommended-courses.result';

@QueryHandler(GetRecommendedCoursesQuery)
@Injectable()
export class GetRecommendedCoursesHandler implements IQueryHandler<GetRecommendedCoursesQuery> {
  constructor(
    @Inject(IAiRecommendationService)
    private readonly aiService: IAiRecommendationService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    query: GetRecommendedCoursesQuery,
  ): Promise<GetRecommendedCoursesResult> {
    const { userId } = query;

    // 1. Get ordered list of IDs from the AI service
    const recommendedIds = await this.aiService.getRecommendedCourseIds(userId);

    if (recommendedIds.length === 0) return [];

    // 2. Hydrate with full data from Prisma (mirrors get-courses query)
    const courses = await this.prisma.course.findMany({
      where: { id: { in: recommendedIds } },
      include: {
        subject: true,
        grade: true,
      },
    });

    // 3. Build a Map for O(1) lookup, then preserve AI-ranked order
    const courseMap = new Map(courses.map((c) => [c.id, c]));

    const result: GetRecommendedCoursesResult = [];
    for (const id of recommendedIds) {
      const c = courseMap.get(id);
      if (!c) continue;
      result.push({
        id: c.id,
        tutorId: c.tutorId,
        title: c.title,
        description: c.description ?? null,
        price: c.price ?? null,
        level: c.level as CourseLevelType,
        status: c.status as unknown as CourseStatus,
        subject: { id: c.subjectId, name: c.subject?.name ?? null },
        grade: { id: c.gradeId, name: c.grade?.name ?? null },
        createdAt: c.createdAt,
      });
    }

    return result;
  }
}
