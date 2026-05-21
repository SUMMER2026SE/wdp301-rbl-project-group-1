import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { GetResourcesByTutorQuery } from './get-resources-by-tutor.query';
import { ResourceByTutorResultData } from './get-resources-by-tutor.result';

@QueryHandler(GetResourcesByTutorQuery)
export class GetResourcesByTutorQueryHandler
  implements
    IQueryHandler<GetResourcesByTutorQuery>,
    IQuery<GetResourcesByTutorQuery, QueryResult<ResourceByTutorResultData>>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(
    query: GetResourcesByTutorQuery,
  ): Promise<QueryResult<ResourceByTutorResultData>> {
    const { params } = query;

    const result = await this.resourceRepository.findByUserId(params);

    const data: ResourceByTutorResultData[] = result.data.map((r) => ({
      id: r.id,
      userId: r.userId,
      name: r.name,
      url: r.url,
      type: r.type.getValue(),
      size: r.size ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return createQueryResult(data, result.total, params);
  }
}
