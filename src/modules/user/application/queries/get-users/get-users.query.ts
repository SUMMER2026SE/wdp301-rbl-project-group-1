import { QueryParams } from '../../../../../shared/domain/common/query';

export class GetUsersQuery {
  constructor(public readonly query: QueryParams) {}
}
