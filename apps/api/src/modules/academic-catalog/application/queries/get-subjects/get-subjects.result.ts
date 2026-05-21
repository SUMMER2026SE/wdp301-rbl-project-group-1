export class SubjectDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly createdAt: Date,
  ) {}
}

export class GetSubjectsResult {
  constructor(public readonly subjects: SubjectDto[]) {}
}
