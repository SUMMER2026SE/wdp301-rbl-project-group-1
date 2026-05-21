export class ApproveTutorApplicationResult {
  constructor(
    public readonly applicationId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly temporaryPassword: string,
  ) {}
}
