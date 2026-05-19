import { Injectable, NotFoundException } from '@nestjs/common';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Resource } from '../../domain/entities/resource.entity';
import {
  IResourceRepository,
  ResourcePaginatedParams,
} from '../../domain/repositories/resource.repository.interface';
import { ResourceMapper } from '../mapper/resource.mapper';
import {
  CourseResourceDelegate,
  LessonResourceDelegate,
  ResourceDelegate,
} from './resource.repository.type';

@Injectable()
export class PrismaResourceRepository implements IResourceRepository {
  private readonly mapper = new ResourceMapper();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the active Prisma transaction client when called inside a
   * `IUnitOfWork.execute()` block, otherwise falls back to the root
   * PrismaService. This allows all repository methods to be fully transactional
   * without requiring explicit tx propagation.
   */
  private get client() {
    return PrismaTransactionContext.getClient() ?? this.prisma;
  }

  private get resourceDelegate(): ResourceDelegate {
    return this.client.resource as unknown as ResourceDelegate;
  }

  private get courseResourceDelegate(): CourseResourceDelegate {
    return this.client.courseResource as unknown as CourseResourceDelegate;
  }

  private get lessonResourceDelegate(): LessonResourceDelegate {
    return this.client.lessonResource as unknown as LessonResourceDelegate;
  }

  async create(resource: Resource): Promise<Resource> {
    const data = this.mapper.toPersistence(resource);
    const savedResource = await this.resourceDelegate.create({ data });
    return this.mapper.toDomain(savedResource);
  }

  async findById(id: string): Promise<Resource | null> {
    const record = await this.resourceDelegate.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }

  async findAll(): Promise<Resource[]> {
    const records = await this.resourceDelegate.findMany();
    return records.map((r) => this.mapper.toDomain(r));
  }

  async findByTarget(
    targetType: 'COURSE' | 'LESSON',
    targetId: string,
  ): Promise<Resource[]> {
    if (targetType === 'COURSE') {
      const rows = await this.courseResourceDelegate.findMany({
        where: { courseId: targetId },
        include: { resource: true },
      });
      return rows
        .filter((r) => r.resource)
        .map((r) => this.mapper.toDomain(r.resource!));
    }

    const rows = await this.lessonResourceDelegate.findMany({
      where: { lessonId: targetId },
      include: { resource: true },
    });
    return rows
      .filter((r) => r.resource)
      .map((r) => this.mapper.toDomain(r.resource!));
  }

  async findByUserId(
    params: ResourcePaginatedParams,
  ): Promise<QueryResult<Resource>> {
    const where: Record<string, unknown> = { userId: params.userId };

    if (params.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'asc' }
      : { createdAt: 'desc' as const };

    const [total, records] = await Promise.all([
      this.resourceDelegate.count({ where }),
      this.resourceDelegate.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
      }),
    ]);

    const resources = records.map((r) => this.mapper.toDomain(r));
    return createQueryResult(resources, total, params);
  }

  async assignToCourse(resourceId: string, courseId: string): Promise<void> {
    try {
      await this.courseResourceDelegate.create({
        data: { courseId, resourceId },
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as Record<string, unknown>).code === 'P2003'
      ) {
        throw new NotFoundException(`Course with id ${courseId} not found`);
      }
      throw error;
    }
  }

  async assignToLesson(resourceId: string, lessonId: string): Promise<void> {
    try {
      await this.lessonResourceDelegate.create({
        data: { lessonId, resourceId },
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as Record<string, unknown>).code === 'P2003'
      ) {
        throw new NotFoundException(`Lesson with id ${lessonId} not found`);
      }
      throw error;
    }
  }

  async unassignFromCourse(
    resourceIds: string[],
    courseId: string,
  ): Promise<number> {
    const result = await this.courseResourceDelegate.deleteMany({
      where: {
        courseId,
        resourceId: { in: resourceIds },
      },
    });
    return result.count;
  }

  async unassignFromLesson(
    resourceIds: string[],
    lessonId: string,
  ): Promise<number> {
    const result = await this.lessonResourceDelegate.deleteMany({
      where: {
        lessonId,
        resourceId: { in: resourceIds },
      },
    });
    return result.count;
  }

  async removeAllFromLesson(lessonId: string): Promise<void> {
    await this.lessonResourceDelegate.deleteMany({
      where: { lessonId },
    });
  }
}
