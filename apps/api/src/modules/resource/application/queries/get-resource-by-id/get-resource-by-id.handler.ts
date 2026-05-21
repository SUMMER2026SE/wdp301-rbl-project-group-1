import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { GetResourceByIdQuery } from './get-resource-by-id.query';
import { GetResourceByIdResult } from './get-resource-by-id.result';

@QueryHandler(GetResourceByIdQuery)
export class GetResourceByIdQueryHandler
  implements
    IQueryHandler<GetResourceByIdQuery>,
    IQuery<GetResourceByIdQuery, GetResourceByIdResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(query: GetResourceByIdQuery): Promise<GetResourceByIdResult> {
    const resource = await this.resourceRepository.findById(query.id);
    if (!resource) {
      throw new NotFoundException(`Resource with id ${query.id} not found`);
    }

    return new GetResourceByIdResult(
      resource.id,
      resource.userId,
      resource.name,
      resource.url,
      resource.type.getValue(),
      resource.size ?? null,
      resource.createdAt,
      resource.updatedAt,
    );
  }
}
