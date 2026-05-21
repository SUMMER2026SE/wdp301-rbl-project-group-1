import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Resource } from '../../domain/entities/resource.entity';
import { ResourceType } from '../../domain/value-objects/resource-type';
import {
  PrismaResourceRecord,
  ResourceWriteData,
} from '../repositories/resource.repository.type';

export class ResourceMapper implements IMapper<
  Resource,
  PrismaResourceRecord | ResourceWriteData
> {
  toDomain(record: PrismaResourceRecord): Resource {
    return Resource.create(record.id, {
      userId: record.userId,
      name: record.name,
      url: record.url,
      type: ResourceType.create(record.type),
      size: record.size,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    });
  }

  toPersistence(resource: Resource): ResourceWriteData {
    const data: ResourceWriteData = {
      ...(resource.id && { id: resource.id }),
      userId: resource.userId,
      name: resource.name,
      url: resource.url,
      type: resource.type.getValue(),
      size: resource.size ?? null,
    };
    return data;
  }
}
