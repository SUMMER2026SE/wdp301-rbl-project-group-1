import { ResourceTypeValue } from '../../../domain/value-objects/resource-type';

export class GetResourceByIdResult {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly url: string,
    public readonly type: ResourceTypeValue,
    public readonly size: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
