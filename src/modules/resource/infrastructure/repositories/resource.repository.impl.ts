import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Resource } from '../../domain/entities/resource.entity';
import { IResourceRepository } from '../../domain/repositories/resource.repository.interface';
import { ResourceMapper } from '../mapper/resource.mapper';
import { ResourceDelegate } from './resource.repository.type';

@Injectable()
export class PrismaResourceRepository implements IResourceRepository {
  private readonly mapper = new ResourceMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get resourceDelegate(): ResourceDelegate {
    return this.prisma.resource as unknown as ResourceDelegate;
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
}
