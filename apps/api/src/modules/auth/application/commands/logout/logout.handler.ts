import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IAuthRepository } from '../../../domain/repositories/auth.repository.interface';
import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler
  implements ICommandHandler<LogoutCommand>, ICommand<LogoutCommand, void>
{
  constructor(
    @Inject(IAuthRepository) private readonly authRepository: IAuthRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    if (!command.refreshToken) {
      return;
    }

    const refreshToken = String(command.refreshToken);

    const storedRefreshToken =
      await this.authRepository.findRefreshTokenByToken(refreshToken);

    if (!storedRefreshToken) {
      return;
    }

    if (storedRefreshToken.userId !== command.userId) {
      return;
    }

    if (storedRefreshToken.revoked) {
      return;
    }

    storedRefreshToken.revoke();
    await this.authRepository.saveRefreshToken(storedRefreshToken);
  }
}
