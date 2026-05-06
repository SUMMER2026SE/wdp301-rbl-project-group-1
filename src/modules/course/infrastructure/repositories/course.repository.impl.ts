import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { Course } from '../../domain/entities/course.entity';
import {
  CoursePaginatedParams,
  CourseWithMeta,
  ICourseRepository,
} from '../../domain/repositories/course.repository.interface';
import { CourseMapper } from '../mapper/course.mapper';
import { CourseDelegate } from './course.repository.type';

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  private readonly mapper = new CourseMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get courseDelegate(): CourseDelegate {
    return this.prisma.course as unknown as CourseDelegate;
  }

  async create(course: Course): Promise<Course> {
    const data = this.mapper.toPersistence(course);
    const savedCourse = await this.courseDelegate.create({ data });
    return this.mapper.toDomain(savedCourse);
  }

  async findById(id: string): Promise<Course | null> {
    const coursePrisma = await this.courseDelegate.findUnique({
      where: { id },
    });
    if (!coursePrisma) return null;
    return this.mapper.toDomain(coursePrisma);
  }

  async findAll(
    params: CoursePaginatedParams,
  ): Promise<QueryResult<CourseWithMeta>> {
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.title = { contains: params.search, mode: 'insensitive' };
    }
    if (params.gradeId) {
      where.gradeId = params.gradeId;
    }
    if (params.subjectId) {
      where.subjectId = params.subjectId;
    }

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'asc' }
      : { createdAt: 'desc' as const };

    const [total, coursesPrisma] = await Promise.all([
      this.courseDelegate.count({ where }),
      this.courseDelegate.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
        include: { subject: true, grade: true },
      }),
    ]);

    const courses: CourseWithMeta[] = coursesPrisma.map((c) => ({
      course: this.mapper.toDomain(c),
      subject: { id: c.subjectId, name: c.subject?.name ?? null },
      grade: { id: c.gradeId, name: c.grade?.name ?? null },
    }));

    return createQueryResult(courses, total, params);
  }
}
