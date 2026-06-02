import { Injectable } from '@nestjs/common';
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
import { ResourceDelegate } from './resource.repository.type';

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

  async create(resource: Resource): Promise<Resource> {
    const data = this.mapper.toPersistence(resource);
    const savedResource = await this.resourceDelegate.create({ data });
    return this.mapper.toDomain(savedResource);
  }

  async findById(id: string): Promise<Resource | null> {
    const record = await this.resourceDelegate.findUnique({
      where: { id },
    });
    if (!record || record.deletedAt) return null;
    return this.mapper.toDomain(record);
  }

  async findAll(): Promise<Resource[]> {
    const records = await this.resourceDelegate.findMany({
      where: { deletedAt: null },
    });
    return records.map((r) => this.mapper.toDomain(r));
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  findByTarget(
    targetType: 'COURSE' | 'LESSON',
    targetId: string,
  ): Promise<Resource[]> {
    return Promise.resolve([]);
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  async findByUserId(
    params: ResourcePaginatedParams,
  ): Promise<QueryResult<Resource>> {
    const where: Record<string, unknown> = {
      userId: params.userId,
      deletedAt: null,
    };

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

  /* eslint-disable @typescript-eslint/no-unused-vars */
  assignToCourse(resourceId: string, courseId: string): Promise<void> {
    return Promise.resolve();
  }

  assignToLesson(resourceId: string, lessonId: string): Promise<void> {
    return Promise.resolve();
  }

  unassignFromCourse(resourceIds: string[], courseId: string): Promise<number> {
    return Promise.resolve(0);
  }

  unassignFromLesson(resourceIds: string[], lessonId: string): Promise<number> {
    return Promise.resolve(0);
  }

  removeAllFromLesson(lessonId: string): Promise<void> {
    return Promise.resolve();
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  async softDelete(id: string, userId: string): Promise<boolean> {
    const result = await this.resourceDelegate.updateMany({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return result.count > 0;
  }
}
