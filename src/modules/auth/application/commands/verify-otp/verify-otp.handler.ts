import { BadRequestException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from 'src/shared/application/interfaces/use-case.interface';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IJwtService } from '../../services/jwt.service';
import { IOtpService } from '../../services/otp.service';
import { VerifyOtpCommand } from './verify-otp.command';
import { VerifyOtpResult } from './verify-otp.result';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpCommandHandler
  implements
    ICommandHandler<VerifyOtpCommand>,
    ICommand<VerifyOtpCommand, VerifyOtpResult>
{
  constructor(
    @Inject(IOtpService) private readonly otpService: IOtpService,
    @Inject(IJwtService) private readonly jwtService: IJwtService,
  ) {}

  async execute(command: VerifyOtpCommand): Promise<VerifyOtpResult> {
    try {
      await this.otpService.verifyOtp(
        command.email,
        OtpType.RESET_PASSWORD,
        command.code,
      );

      const resetToken = await this.jwtService.signReset({
        sub: command.email,
        type: 'reset_token',
      });

      return new VerifyOtpResult('OTP verified successfully', resetToken);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Failed to verify OTP');
    }
  }
}
