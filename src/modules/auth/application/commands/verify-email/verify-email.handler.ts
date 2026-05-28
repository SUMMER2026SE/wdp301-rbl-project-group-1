import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TutorApplicationRepository } from 'src/modules/tutor-application/domain/repositories/tutor-application.repository';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository.interface';
import { ICommand } from 'src/shared/application/interfaces/use-case.interface';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IOtpService } from '../../services/otp.service';
import { VerifyEmailCommand } from './verify-email.command';
import { VerifyEmailResult } from './verify-email.result';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailCommandHandler
  implements
    ICommandHandler<VerifyEmailCommand>,
    ICommand<VerifyEmailCommand, VerifyEmailResult>
{
  constructor(
    @Inject(IOtpService) private readonly otpService: IOtpService,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(TutorApplicationRepository)
    private readonly tutorApplicationRepository: TutorApplicationRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<VerifyEmailResult> {
    try {
      await this.otpService.verifyOtp(
        command.email,
        OtpType.VERIFY_EMAIL,
        command.code,
      );

      // If a User exists, update isVerified on User
      const user = await this.userRepository.findByEmail(command.email);
      if (user) {
        user.verify();
        await this.userRepository.save(user);
        return new VerifyEmailResult('Email verified successfully.', true);
      }

      // If no User but a TutorApplication exists, OTP was validated successfully.
      // No entity update needed — User.isVerified will be set when admin approves.
      const application =
        await this.tutorApplicationRepository.findByEmail(command.email);
      if (application) {
        return new VerifyEmailResult('Email verified successfully.', true);
      }

      throw new BadRequestException(
        'No account or application found for this email.',
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to verify email.');
    }
  }
}
