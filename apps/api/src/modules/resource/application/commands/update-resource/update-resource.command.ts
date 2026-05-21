import { AssignTarget } from '../../../domain/repositories/resource.repository.interface';
import { ResourceTypeValue } from '../../../domain/value-objects/resource-type';

export interface NewResourceData {
  name: string;
  url: string;
  type: ResourceTypeValue;
  size?: number | null;
}

/**
 * Unified resource update command.
 *
 * action:
 *  - 'ASSIGN'   → assign existing / new resources to the target
 *  - 'UNASSIGN' → remove resource assignments from the target
 *  - 'REPLACE'  → remove all current assignments then assign the given ones
 */
export type UpdateResourceAction = 'ASSIGN' | 'UNASSIGN' | 'REPLACE';

export class UpdateResourceCommand {
  constructor(
    public readonly userId: string,
    public readonly action: UpdateResourceAction,
    public readonly targetType: AssignTarget,
    public readonly targetId: string,
    public readonly resourceIds?: string[],
    public readonly resources?: NewResourceData[],
  ) {}
}
