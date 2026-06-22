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
import { BanUserCommand } from './ban-user.command';
import { BanUserResult } from './ban-user.result';

@CommandHandler(BanUserCommand)
export class BanUserHandler
  implements
    ICommandHandler<BanUserCommand>,
    ICommand<BanUserCommand, BanUserResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: BanUserCommand): Promise<BanUserResult> {
    const admin = await this.userRepository.findById(command.adminId);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can ban users');
    }

    const target = await this.userRepository.findById(command.targetUserId);
    if (!target) {
      throw new NotFoundException('User not found');
    }

    if (target.role === UserRole.ADMIN) {
      throw new ForbiddenException('Cannot ban another admin');
    }

    if (!target.isActive) {
      throw new BadRequestException('User is already banned');
    }

    target.deactivate();
    await this.userRepository.save(target);

    return new BanUserResult(target.id, 'User has been banned successfully');
  }
}
