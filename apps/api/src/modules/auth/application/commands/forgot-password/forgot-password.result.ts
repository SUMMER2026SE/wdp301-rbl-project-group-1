export class ForgotPasswordResult {
  constructor(
    public readonly message: string,
    public readonly expiresAt: string,
  ) {}
}
