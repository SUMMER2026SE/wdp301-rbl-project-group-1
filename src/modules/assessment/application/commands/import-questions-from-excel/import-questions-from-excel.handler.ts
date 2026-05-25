import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import * as ExcelJS from 'exceljs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  QuestionDifficulty,
  QuestionType,
} from '../../../../../shared/domain/enums/enums';
import { Question } from '../../../domain/entities/question.entity';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { ImportQuestionsFromExcelCommand } from './import-questions-from-excel.command';
import {
  ImportQuestionsFromExcelResult,
  ImportRowError,
} from './import-questions-from-excel.result';

/**
 * Expected Excel format (first sheet):
 *
 * | content        | type            | difficulty | points | option_1 | correct_1 | option_2 | correct_2 | option_3 | correct_3 | option_4 | correct_4 |
 * |----------------|-----------------|------------|--------|----------|-----------|----------|-----------|----------|-----------|----------|-----------|
 * | 1 + 1 = ?      | MULTIPLE_CHOICE | EASY       | 10     | 2        | TRUE      | 3        | FALSE     | 4        | FALSE     | 5        | FALSE     |
 * | True or false? | TRUE_FALSE      | MEDIUM     | 5      | True     | TRUE      | False    | FALSE     |          |           |          |           |
 *
 * - Columns: content, type, difficulty, points, then pairs of (option_N, correct_N) for up to 6 options.
 * - `correct_N` accepts: TRUE/FALSE, true/false, 1/0, yes/no, x/empty.
 * - `type` accepts: MULTIPLE_CHOICE, TRUE_FALSE, TEXT_ANSWER (case-insensitive).
 * - `difficulty` accepts: EASY, MEDIUM, HARD (case-insensitive).
 */
const VALID_TYPES = Object.values(QuestionType);
const VALID_DIFFICULTIES = Object.values(QuestionDifficulty);
const MAX_OPTIONS = 6;

@CommandHandler(ImportQuestionsFromExcelCommand)
export class ImportQuestionsFromExcelCommandHandler
  implements
    ICommandHandler<ImportQuestionsFromExcelCommand>,
    ICommand<ImportQuestionsFromExcelCommand, ImportQuestionsFromExcelResult>
{
  private readonly logger = new Logger(
    ImportQuestionsFromExcelCommandHandler.name,
  );

  constructor(
    @Inject(IQuestionBankRepository)
    private readonly questionBankRepository: IQuestionBankRepository,
  ) {}

  async execute(
    command: ImportQuestionsFromExcelCommand,
  ): Promise<ImportQuestionsFromExcelResult> {
    // Validate bank exists
    const bank = await this.questionBankRepository.findById(command.bankId);
    if (!bank) {
      throw new NotFoundException(`Question bank ${command.bankId} not found`);
    }

    // Parse Excel
    const workbook = new ExcelJS.Workbook();
    // @ts-expect-error -- @types/node v22 changed Buffer to Buffer<ArrayBufferLike>, ExcelJS still expects non-generic Buffer
    await workbook.xlsx.load(command.fileBuffer);
    const sheet = workbook.worksheets[0];

    if (!sheet || sheet.rowCount < 2) {
      return new ImportQuestionsFromExcelResult(0, 0, 0, [
        { row: 0, field: 'file', message: 'Empty file or no data rows found' },
      ]);
    }

    // Read header row to build column index map
    const headerRow = sheet.getRow(1);
    const colMap = this.buildColumnMap(headerRow);

    const errors: ImportRowError[] = [];
    const questions: Question[] = [];
    let totalRows = 0;

    // Process data rows (starting from row 2)
    for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);

      // Skip completely empty rows
      if (!row.getCell(1).value && !row.getCell(2).value) continue;
      totalRows++;

      const rowErrors: ImportRowError[] = [];

      // ── Parse required fields ──
      const content = this.getCellString(row, colMap.content);
      if (!content) {
        rowErrors.push({
          row: rowNum,
          field: 'content',
          message: 'Question content is required',
        });
      }

      const typeRaw = this.getCellString(row, colMap.type)?.toUpperCase();
      const type = typeRaw as QuestionType;
      if (!typeRaw || !VALID_TYPES.includes(type)) {
        rowErrors.push({
          row: rowNum,
          field: 'type',
          message: `Invalid type "${typeRaw}". Must be one of: ${VALID_TYPES.join(', ')}`,
        });
      }

      const difficultyRaw = this.getCellString(
        row,
        colMap.difficulty,
      )?.toUpperCase();
      const difficulty = difficultyRaw as QuestionDifficulty;
      if (!difficultyRaw || !VALID_DIFFICULTIES.includes(difficulty)) {
        rowErrors.push({
          row: rowNum,
          field: 'difficulty',
          message: `Invalid difficulty "${difficultyRaw}". Must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
        });
      }

      const pointsRaw = row.getCell(colMap.points).value;
      const pointsStr =
        pointsRaw !== null && pointsRaw !== undefined
          ? String(pointsRaw as string | number | boolean)
          : '';
      const points =
        typeof pointsRaw === 'number' ? pointsRaw : parseFloat(pointsStr);
      if (isNaN(points) || points < 0) {
        rowErrors.push({
          row: rowNum,
          field: 'points',
          message: `Invalid points "${pointsStr}". Must be a non-negative number`,
        });
      }

      // ── Parse options ──
      const options: {
        content: string;
        isCorrect: boolean;
        orderIndex: number;
      }[] = [];
      for (let i = 1; i <= MAX_OPTIONS; i++) {
        const optCol = colMap[`option_${i}`];
        const correctCol = colMap[`correct_${i}`];
        if (!optCol) break;

        const optContent = this.getCellString(row, optCol);
        if (!optContent) continue; // Empty option slot — skip

        const isCorrect = this.parseBooleanCell(row, correctCol);
        options.push({
          content: optContent,
          isCorrect,
          orderIndex: i - 1,
        });
      }

      // Validate options for non-TEXT_ANSWER
      if (type !== QuestionType.TEXT_ANSWER && options.length === 0) {
        rowErrors.push({
          row: rowNum,
          field: 'options',
          message:
            'At least one option is required for non-text-answer questions',
        });
      }

      if (
        type !== QuestionType.TEXT_ANSWER &&
        options.length > 0 &&
        !options.some((o) => o.isCorrect)
      ) {
        rowErrors.push({
          row: rowNum,
          field: 'options',
          message: 'At least one option must be marked as correct',
        });
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        continue;
      }

      // ── Build entity ──
      const question = Question.create(randomUUID(), {
        bankId: command.bankId,
        type,
        difficulty,
        content: content!,
        points: points,
        orderIndex: questions.length,
        options: options.map((o) => ({
          id: randomUUID(),
          ...o,
        })),
      });

      questions.push(question);
    }

    // Persist valid questions
    let importedCount = 0;
    for (const question of questions) {
      try {
        await this.questionBankRepository.addQuestion(question);
        importedCount++;
      } catch (err) {
        errors.push({
          row: 0,
          field: 'database',
          message: `Failed to save question "${question.content.substring(0, 30)}...": ${(err as Error).message}`,
        });
      }
    }

    this.logger.log(
      `Excel import to bank ${command.bankId}: ${importedCount}/${totalRows} imported, ${errors.length} errors`,
    );

    return new ImportQuestionsFromExcelResult(
      totalRows,
      importedCount,
      totalRows - importedCount,
      errors,
    );
  }

  // ── Helpers ──

  private buildColumnMap(headerRow: ExcelJS.Row): Record<string, number> {
    const map: Record<string, number> = {};
    headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
      const name = String((cell.value ?? '') as string | number | boolean)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
      if (name) map[name] = colNumber;
    });
    return map;
  }

  private getCellString(row: ExcelJS.Row, colNumber?: number): string | null {
    if (!colNumber) return null;
    const value = row.getCell(colNumber).value;
    if (value === null || value === undefined) return null;

    // Handle ExcelJS rich text
    if (typeof value === 'object' && value !== null && 'richText' in value) {
      const richTextValue = value;
      return richTextValue.richText
        .map((r: ExcelJS.RichText) => r.text)
        .join('')
        .trim();
    }

    const str = String(value as string | number | boolean).trim();
    return str || null;
  }

  private parseBooleanCell(row: ExcelJS.Row, colNumber?: number): boolean {
    if (!colNumber) return false;
    const value = row.getCell(colNumber).value;
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;

    const str = String(value as string | number | boolean)
      .trim()
      .toLowerCase();
    return ['true', '1', 'yes', 'x', 'đúng'].includes(str);
  }
}
