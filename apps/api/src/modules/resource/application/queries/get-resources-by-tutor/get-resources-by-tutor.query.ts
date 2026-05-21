import { ResourcePaginatedParams } from '../../../domain/repositories/resource.repository.interface';

export class GetResourcesByTutorQuery {
  constructor(public readonly params: ResourcePaginatedParams) {}
}
