import { OtpType } from 'src/shared/domain/enums/enums';

export const IOtpService = Symbol('IOtpService');
export interface IOtpService {
  generateOtp(
    email: string,
    type: OtpType,
  ): Promise<{ code: string; expiresAt: Date }>;

  verifyOtp(email: string, type: OtpType, code: string): Promise<boolean>;

  resendOtp(
    email: string,
    type: OtpType,
  ): Promise<{ code: string; expiresAt: Date }>;
}
