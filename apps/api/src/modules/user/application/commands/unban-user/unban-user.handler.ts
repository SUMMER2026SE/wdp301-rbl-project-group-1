import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UnbanUserCommand } from './unban-user.command';
import { UnbanUserResult } from './unban-user.result';

@CommandHandler(UnbanUserCommand)
export class UnbanUserHandler
  implements
    ICommandHandler<UnbanUserCommand>,
    ICommand<UnbanUserCommand, UnbanUserResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UnbanUserCommand): Promise<UnbanUserResult> {
    const admin = await this.userRepository.findById(command.adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can unban users');
    }

    const target = await this.userRepository.findById(command.targetUserId);
    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (target.isActive) {
      throw new BadRequestException('User is not banned');
    }

    target.activate();
    await this.userRepository.save(target);

    return new UnbanUserResult(target.id, 'User has been unbanned successfully');
  }
}
