import { AssignTarget } from '../../../domain/repositories/resource.repository.interface';
import { ResourceTypeValue } from '../../../domain/value-objects/resource-type';

export interface NewResourceData {
  name: string;
  url: string;
  type: ResourceTypeValue;
  size?: number | null;
}

export class AssignResourceCommand {
  constructor(
    public readonly userId: string,
    public readonly targetType: AssignTarget,
    public readonly targetId: string,
    public readonly resourceIds?: string[],
    public readonly resources?: NewResourceData[],
  ) {}
}
