import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { ResourceDto } from '../get-all-resources/get-all-resources.result';
import { GetResourcesByTargetQuery } from './get-resources-by-target.query';
import { GetResourcesByTargetResult } from './get-resources-by-target.result';

@QueryHandler(GetResourcesByTargetQuery)
export class GetResourcesByTargetQueryHandler
  implements
    IQueryHandler<GetResourcesByTargetQuery>,
    IQuery<GetResourcesByTargetQuery, GetResourcesByTargetResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(
    query: GetResourcesByTargetQuery,
  ): Promise<GetResourcesByTargetResult> {
    const resources = await this.resourceRepository.findByTarget(
      query.targetType,
      query.targetId,
    );
    const dtos = resources.map(
      (r) =>
        new ResourceDto(
          r.id,
          r.userId,
          r.name,
          r.url,
          r.type.getValue(),
          r.size ?? null,
          r.createdAt,
          r.updatedAt,
        ),
    );
    return new GetResourcesByTargetResult(dtos);
  }
}
