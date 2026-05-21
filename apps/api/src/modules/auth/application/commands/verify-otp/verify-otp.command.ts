export class VerifyOtpCommand {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
