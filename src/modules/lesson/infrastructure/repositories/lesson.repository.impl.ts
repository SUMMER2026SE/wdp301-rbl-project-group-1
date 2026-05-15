import { Injectable } from '@nestjs/common';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
  ILessonRepository,
  LessonPaginatedParams,
  LessonWithDetails,
} from '../../domain/repositories/lesson.repository.interface';
import { LessonMapper } from '../mapper/lesson.mapper';
import { LessonDelegate } from './lesson.repository.type';

@Injectable()
export class PrismaLessonRepository implements ILessonRepository {
  private readonly mapper = new LessonMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get lessonDelegate(): LessonDelegate {
    return this.prisma.lesson as unknown as LessonDelegate;
  }

  async create(lesson: Lesson): Promise<Lesson> {
    const data = this.mapper.toPersistence(lesson);
    const saved = await this.lessonDelegate.create({ data });
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<Lesson | null> {
    const record = await this.lessonDelegate.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }

  async findByCourseId(
    params: LessonPaginatedParams,
  ): Promise<QueryResult<Lesson>> {
    const where: Record<string, unknown> = { courseId: params.courseId };

    if (params.search) {
      where.title = { contains: params.search, mode: 'insensitive' };
    }

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'asc' }
      : { orderIndex: 'asc' as const };

    const [total, records] = await Promise.all([
      this.lessonDelegate.count({ where }),
      this.lessonDelegate.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
      }),
    ]);

    const lessons = records.map((r) => this.mapper.toDomain(r));
    return createQueryResult(lessons, total, params);
  }

  async findByIdWithDetails(id: string): Promise<LessonWithDetails | null> {
    const record = await this.lessonDelegate.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            subject: true,
            grade: true,
            tutor: { include: { user: { include: { profile: true } } } },
          },
        },
      },
    });
    if (!record) return null;

    const { course } = record;
    const { tutor } = course;

    return {
      lesson: this.mapper.toDomain(record),
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        subjectName: course.subject?.name ?? null,
        gradeName: course.grade?.name ?? null,
        level: course.level,
        status: course.status,
      },
      tutor: {
        id: tutor.user.id,
        email: tutor.user.email,
        nickname: tutor.user.profile?.nickname ?? null,
        avatarUrl: tutor.user.profile?.avatarUrl ?? null,
      },
    };
  }

  async update(lesson: Lesson): Promise<Lesson> {
    const data = this.mapper.toPersistence(lesson);
    const updated = await this.lessonDelegate.update({
      where: { id: lesson.id },
      data,
    });
    return this.mapper.toDomain(updated);
  }
}
