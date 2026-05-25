export interface ImportRowError {
  row: number;
  field: string;
  message: string;
}

export class ImportQuestionsFromExcelResult {
  constructor(
    public readonly totalRows: number,
    public readonly importedCount: number,
    public readonly skippedCount: number,
    public readonly errors: ImportRowError[],
  ) {}
}
