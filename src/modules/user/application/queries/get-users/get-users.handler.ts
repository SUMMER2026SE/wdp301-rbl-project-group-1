import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { GetUsersQuery } from './get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(_query: GetUsersQuery): Promise<User[]> {
    void _query;
    return this.userRepository.findAll();
  }
}
