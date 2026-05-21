export class ConfirmPaymentResult {
  constructor(
    public readonly success: boolean,
    public readonly message?: string,
  ) {}
}
