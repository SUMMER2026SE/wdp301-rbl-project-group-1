import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions/domain-exception';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { GetMeQuery } from './get-me.query';
import { GetMeResult } from './get-me.result';

@QueryHandler(GetMeQuery)
export class GetMeQueryHandler implements IQueryHandler<GetMeQuery> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: GetMeQuery): Promise<GetMeResult> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isFlag: user.isFlag,
      reportCount: user.reportCount,
      createdAt: user.createdAt,
    };
  }
}
