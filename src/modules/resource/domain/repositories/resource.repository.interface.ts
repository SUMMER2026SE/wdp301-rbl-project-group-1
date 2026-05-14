import { type Resource } from '../entities/resource.entity';

export const IResourceRepository = Symbol('IResourceRepository');

export interface IResourceRepository {
  create(resource: Resource): Promise<Resource>;
  findById(id: string): Promise<Resource | null>;
}
