export class VerifyOtpResult {
  constructor(
    public readonly message: string,
    public readonly resetToken: string,
  ) {}
}
