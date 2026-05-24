export class GetCourseByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId?: string,
  ) {}
}
