export class GetUserProfileByIdQuery {
  constructor(
    public readonly id: string,
    public readonly viewerId?: string,
  ) {}
}
