import { BadRequestException, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailCommand } from 'src/modules/notification/application/commands/send-email/send-email.command';
import { TutorApplicationRepository } from 'src/modules/tutor-application/domain/repositories/tutor-application.repository';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository.interface';
import { ICommand } from 'src/shared/application/interfaces/use-case.interface';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IOtpService } from '../../services/otp.service';
import { SendVerifyEmailOtpCommand } from './send-verify-email-otp.command';
import { SendVerifyEmailOtpResult } from './send-verify-email-otp.result';

@CommandHandler(SendVerifyEmailOtpCommand)
export class SendVerifyEmailOtpCommandHandler
  implements
    ICommandHandler<SendVerifyEmailOtpCommand>,
    ICommand<SendVerifyEmailOtpCommand, SendVerifyEmailOtpResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(TutorApplicationRepository)
    private readonly tutorApplicationRepository: TutorApplicationRepository,
    @Inject(IOtpService) private readonly otpService: IOtpService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(
    command: SendVerifyEmailOtpCommand,
  ): Promise<SendVerifyEmailOtpResult> {
    // First check if a User exists
    const user = await this.userRepository.findByEmail(command.email);

    if (user) {
      if (user.isVerified) {
        throw new BadRequestException('Email is already verified.');
      }

      const { code, expiresAt } = await this.otpService.generateOtp(
        command.email,
        OtpType.VERIFY_EMAIL,
        user.id,
      );

      await this.commandBus.execute(
        new SendEmailCommand(
          command.email,
          'Edura - Xác minh email của bạn',
          'otp',
          { otp: code },
        ),
      );

      return new SendVerifyEmailOtpResult(
        'An OTP has been sent to your email address.',
        expiresAt.toISOString(),
      );
    }

    // If no User, check TutorApplication
    const application =
      await this.tutorApplicationRepository.findByEmail(command.email);

    if (application) {
      const { code, expiresAt } = await this.otpService.generateOtp(
        command.email,
        OtpType.VERIFY_EMAIL,
      );

      await this.commandBus.execute(
        new SendEmailCommand(
          command.email,
          'Edura - Xác minh email của bạn',
          'otp',
          { otp: code },
        ),
      );

      return new SendVerifyEmailOtpResult(
        'An OTP has been sent to your email address.',
        expiresAt.toISOString(),
      );
    }

    throw new BadRequestException('No account or application found for this email.');
  }
}
