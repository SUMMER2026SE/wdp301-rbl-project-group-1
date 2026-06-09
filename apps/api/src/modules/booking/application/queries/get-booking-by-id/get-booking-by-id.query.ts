export class GetBookingByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
