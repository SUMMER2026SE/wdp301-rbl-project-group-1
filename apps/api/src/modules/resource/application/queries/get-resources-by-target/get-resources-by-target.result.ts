import { ResourceDto } from '../get-all-resources/get-all-resources.result';

export class GetResourcesByTargetResult {
  constructor(public readonly resources: ResourceDto[]) {}
}
