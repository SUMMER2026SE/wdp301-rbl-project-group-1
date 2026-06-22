export class BanUserResult {
  constructor(
    public readonly userId: string,
    public readonly message: string,
  ) {}
}
