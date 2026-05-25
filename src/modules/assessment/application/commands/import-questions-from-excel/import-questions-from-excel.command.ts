export class ImportQuestionsFromExcelCommand {
  constructor(
    public readonly bankId: string,
    public readonly fileBuffer: Buffer,
  ) {}
}
