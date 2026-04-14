import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/application/common/query';
import {
  FindAllUsersParams,
  IUserRepository,
} from '../../../domain/repositories/user.repository.interface';
import { GetUsersQuery } from './get-users.query';
import { GetUsersResultData } from './get-users.result';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    query: GetUsersQuery,
  ): Promise<QueryResult<GetUsersResultData>> {
    const repositoryParams: FindAllUsersParams = {
      skip: query.query.skip,
      limit: query.query.limit,
      search: query.query.search,
      sortBy: query.query.sortBy,
      sortOrder: query.query.sortOrder,
      filters: query.query.filters,
    };

    const repoResult = await this.userRepository.findAll(repositoryParams);

    const data: GetUsersResultData[] = repoResult.items.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname ?? null,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isFlag: user.isFlag,
      reportCount: user.reportCount,
      createdAt: user.createdAt,
    }));

    return createQueryResult(data, repoResult.total, query.query);
  }
}
