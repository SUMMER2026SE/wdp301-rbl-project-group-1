export class SendVerifyEmailOtpResult {
  constructor(
    public readonly message: string,
    public readonly expiresAt: string,
  ) {}
}
