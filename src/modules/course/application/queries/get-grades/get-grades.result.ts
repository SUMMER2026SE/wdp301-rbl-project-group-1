export class GradeDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly order: number,
    public readonly createdAt: Date,
  ) {}
}

export class GetGradesResult {
  constructor(public readonly grades: GradeDto[]) {}
}
