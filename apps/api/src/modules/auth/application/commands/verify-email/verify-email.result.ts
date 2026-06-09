export class VerifyEmailResult {
  constructor(
    public readonly message: string,
    public readonly success: boolean,
  ) {}
}
