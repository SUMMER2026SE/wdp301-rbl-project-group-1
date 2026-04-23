import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository.interface';
import { ICommand } from 'src/shared/application/interfaces/use-case.interface';
import { IHashService } from '../../services/hash.service';
import { ResetPasswordCommand } from './reset-password.command';
import { ResetPasswordResult } from './reset-password.result';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements
    ICommandHandler<ResetPasswordCommand>,
    ICommand<ResetPasswordCommand, ResetPasswordResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<ResetPasswordResult> {
    try {
      const user = await this.userRepository.findByEmail(command.email);
      if (!user) {
        throw new BadRequestException('User with this email does not exist.');
      }

      const hashedPassword = await this.hashService.hash(command.newPassword);
      user.updatePassword(hashedPassword);

      await this.userRepository.save(user);

      return new ResetPasswordResult(
        'Password has been successfully reset',
        true,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to reset password');
    }
  }
}
