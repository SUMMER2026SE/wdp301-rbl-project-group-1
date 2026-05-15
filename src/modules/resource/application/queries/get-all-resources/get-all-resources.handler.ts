import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { GetAllResourcesQuery } from './get-all-resources.query';
import { GetAllResourcesResult, ResourceDto } from './get-all-resources.result';

@QueryHandler(GetAllResourcesQuery)
export class GetAllResourcesQueryHandler
  implements
    IQueryHandler<GetAllResourcesQuery>,
    IQuery<GetAllResourcesQuery, GetAllResourcesResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute() // _query: GetAllResourcesQuery
  : Promise<GetAllResourcesResult> {
    const resources = await this.resourceRepository.findAll();
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
    return new GetAllResourcesResult(dtos);
  }
}
