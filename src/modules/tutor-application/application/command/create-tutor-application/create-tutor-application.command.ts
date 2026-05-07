export class CreateTutorApplicationCommand {
  constructor(
    public readonly email: string,
    public readonly specialization: string,
    public readonly bio?: string,
    public readonly experience?: number,
    public readonly education?: string,
    public readonly pricePerHour?: number,
  ) {}
}
