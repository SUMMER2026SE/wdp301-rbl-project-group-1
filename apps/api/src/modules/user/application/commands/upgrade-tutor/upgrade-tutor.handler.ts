import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import {
  ConflictException,
  EntityNotFoundException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UpgradeTutorCommand } from './upgrade-tutor.command';
import { UpgradeTutorResult } from './upgrade-tutor.result';

@CommandHandler(UpgradeTutorCommand)
export class UpgradeTutorCommandHandler implements ICommandHandler<
  UpgradeTutorCommand,
  UpgradeTutorResult
> {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpgradeTutorCommand): Promise<UpgradeTutorResult> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new EntityNotFoundException('User', command.userId);
    }

    if (user.role === UserRole.TUTOR) {
      throw new ConflictException('User is already a tutor');
    }

    user.upgradeToTutor();

    await this.userRepository.save(user);

    return new UpgradeTutorResult(true);
  }
}
