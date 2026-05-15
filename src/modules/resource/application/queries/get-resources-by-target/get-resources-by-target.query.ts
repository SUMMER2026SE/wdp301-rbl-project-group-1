import { AssignTarget } from '../../../domain/repositories/resource.repository.interface';

export class GetResourcesByTargetQuery {
  constructor(
    public readonly targetType: AssignTarget,
    public readonly targetId: string,
  ) {}
}
