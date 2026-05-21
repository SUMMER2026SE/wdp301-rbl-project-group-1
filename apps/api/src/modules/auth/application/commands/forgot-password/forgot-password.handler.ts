import { BadRequestException, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from 'src/modules/notification/application/commands/send-email/send-email.command';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository.interface';
import { ICommand } from 'src/shared/application/interfaces/use-case.interface';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IOtpService } from '../../services/otp.service';
import { ForgotPasswordCommand } from './forgot-password.command';
import { ForgotPasswordResult } from './forgot-password.result';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler
  implements
    ICommandHandler<ForgotPasswordCommand>,
    ICommand<ForgotPasswordCommand, ForgotPasswordResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IOtpService) private readonly otpService: IOtpService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<ForgotPasswordResult> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new BadRequestException('User with this email does not exist.');
    }

    const { code, expiresAt } = await this.otpService.generateOtp(
      command.email,
      OtpType.RESET_PASSWORD,
      user.id,
    );

    await this.commandBus.execute(
      new SendEmailCommand(
        command.email,
        'Edura - Password Reset Request',
        'otp',
        { otp: code },
      ),
    );

    return new ForgotPasswordResult(
      'An OTP has been sent to your email address.',
      expiresAt.toISOString(),
    );
  }
}
