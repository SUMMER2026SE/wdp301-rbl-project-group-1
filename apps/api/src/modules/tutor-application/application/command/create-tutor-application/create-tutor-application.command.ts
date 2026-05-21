export class CreateTutorApplicationCommand {
  constructor(
    public readonly email: string,
    public readonly specialization: string,
    public readonly subjectIds: string[],
    public readonly gradeIds: string[],
    public readonly bio?: string,
    public readonly experience?: number,
    public readonly education?: string,
    public readonly pricePerHour?: number,
    public readonly avatarUrl?: string,
    public readonly files?: string[],
  ) {}
}
