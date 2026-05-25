import 'multer'; // Augment Express namespace with Multer types
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AssessmentType,
  GradingPolicy,
  QuestionDifficulty,
  QuestionType,
  UserRole,
} from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';

// Commands
import { AddQuestionToBankCommand } from '../../application/commands/add-question-to-bank/add-question-to-bank.command';
import { AddQuestionToBankResult } from '../../application/commands/add-question-to-bank/add-question-to-bank.result';
import { CreateAssessmentCommand } from '../../application/commands/create-assessment/create-assessment.command';
import { CreateAssessmentResult } from '../../application/commands/create-assessment/create-assessment.result';
import { CreateQuestionBankCommand } from '../../application/commands/create-question-bank/create-question-bank.command';
import { CreateQuestionBankResult } from '../../application/commands/create-question-bank/create-question-bank.result';
import { StartAttemptCommand } from '../../application/commands/start-attempt/start-attempt.command';
import { StartAttemptResult } from '../../application/commands/start-attempt/start-attempt.result';
import { SubmitAttemptCommand } from '../../application/commands/submit-attempt/submit-attempt.command';
import { SubmitAttemptResult } from '../../application/commands/submit-attempt/submit-attempt.result';
import { ImportQuestionsFromExcelCommand } from '../../application/commands/import-questions-from-excel/import-questions-from-excel.command';
import { ImportQuestionsFromExcelResult } from '../../application/commands/import-questions-from-excel/import-questions-from-excel.result';

// Queries
import { GetAssessmentsQuery } from '../../application/queries/get-assessments/get-assessments.query';
import { GetAttemptResultQuery } from '../../application/queries/get-attempt-result/get-attempt-result.query';
import { GetGradebookQuery } from '../../application/queries/get-gradebook/get-gradebook.query';
import { GetQuestionBanksQuery } from '../../application/queries/get-question-banks/get-question-banks.query';
import { GetQuestionsQuery } from '../../application/queries/get-questions/get-questions.query';

// Domain types for query results
import { Assessment } from '../../domain/entities/assessment.entity';
import { GradebookRecord } from '../../domain/entities/gradebook-record.entity';
import { QuestionBank } from '../../domain/entities/question-bank.entity';
import { Question } from '../../domain/entities/question.entity';
import { AttemptWithQuestionsAndAnswers } from '../../domain/repositories/attempt.repository.interface';
import { QueryResult } from '../../../../shared/domain/common/query';

// DTOs
import {
  AddQuestionDto,
  CreateAssessmentDto,
  CreateQuestionBankDto,
  SubmitAttemptDto,
} from '../schemas/assessment.dto';
import {
  AssessmentResponseDto,
  GradebookResponseDto,
  IdResultDto,
  ImportQuestionsResponseDto,
  QuestionBankResponseDto,
  StartAttemptResponseDto,
  SubmitAttemptResponseDto,
} from '../schemas/assessment-response.dto';

@ApiTags('Assessment')
@Controller('assessments')
export class AssessmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // ── Question Bank ──

  @Post('banks')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createQuestionBank',
    summary: 'Create a question bank for a course',
  })
  @ApiCreatedResponseWrapped(IdResultDto, {
    description: 'Question bank created successfully.',
  })
  async createQuestionBank(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateQuestionBankDto,
  ): Promise<BaseResponse<CreateQuestionBankResult>> {
    const cmd = new CreateQuestionBankCommand(
      user.userId,
      dto.courseId,
      dto.title,
      dto.description,
    );
    const result = await this.commandBus.execute<
      CreateQuestionBankCommand,
      CreateQuestionBankResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  @Get('banks/course/:courseId')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getQuestionBanksByCourse',
    summary: 'Get question banks for a course',
  })
  @ApiOkResponseWrapped(QuestionBankResponseDto, {
    description: 'Question banks returned.',
  })
  async getQuestionBanks(
    @Param('courseId') courseId: string,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ) {
    const query = new GetQuestionBanksQuery(
      courseId,
      skip ? parseInt(skip) : 0,
      limit ? parseInt(limit) : 20,
    );
    const result = await this.queryBus.execute<
      GetQuestionBanksQuery,
      QueryResult<QuestionBank>
    >(query);
    return BaseResponse.ok(result);
  }

  // ── Questions ──

  @Post('banks/:bankId/questions')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'addQuestionToBank',
    summary: 'Add a question to a bank',
  })
  @ApiCreatedResponseWrapped(IdResultDto, {
    description: 'Question added successfully.',
  })
  async addQuestion(
    @Param('bankId') bankId: string,
    @Body() dto: AddQuestionDto,
  ): Promise<BaseResponse<AddQuestionToBankResult>> {
    const cmd = new AddQuestionToBankCommand(
      bankId,
      dto.type as QuestionType,
      dto.difficulty as QuestionDifficulty,
      dto.content,
      dto.points,
      dto.orderIndex,
      dto.options,
    );
    const result = await this.commandBus.execute<
      AddQuestionToBankCommand,
      AddQuestionToBankResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  @Get('banks/:bankId/questions')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getQuestionsByBank',
    summary: 'Get questions in a bank',
  })
  @ApiOkResponseWrapped(QuestionBankResponseDto, {
    description: 'Questions returned.',
  })
  async getQuestions(
    @Param('bankId') bankId: string,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ) {
    const query = new GetQuestionsQuery(
      bankId,
      skip ? parseInt(skip) : 0,
      limit ? parseInt(limit) : 20,
    );
    const result = await this.queryBus.execute<
      GetQuestionsQuery,
      QueryResult<Question>
    >(query);
    return BaseResponse.ok(result);
  }

  @Post('banks/:bankId/import-excel')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const allowedMimes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only .xlsx and .xls files are allowed'),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({
    operationId: 'importQuestionsFromExcel',
    summary: 'Import questions from an Excel file into a bank',
  })
  @ApiCreatedResponseWrapped(ImportQuestionsResponseDto, {
    description: 'Import completed with summary.',
  })
  async importQuestionsFromExcel(
    @Param('bankId') bankId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponse<ImportQuestionsFromExcelResult>> {
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }
    const cmd = new ImportQuestionsFromExcelCommand(bankId, file.buffer);
    const result = await this.commandBus.execute<
      ImportQuestionsFromExcelCommand,
      ImportQuestionsFromExcelResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  // ── Assessment ──

  @Post()
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createAssessment',
    summary: 'Create a quiz or exam',
  })
  @ApiCreatedResponseWrapped(IdResultDto, {
    description: 'Assessment created successfully.',
  })
  async createAssessment(
    @Body() dto: CreateAssessmentDto,
  ): Promise<BaseResponse<CreateAssessmentResult>> {
    const cmd = new CreateAssessmentCommand(
      dto.courseId,
      dto.title,
      dto.type as AssessmentType,
      dto.gradingPolicy as GradingPolicy,
      dto.isRandomized,
      dto.shuffleOptions,
      dto.antiCheat,
      dto.bankConfigs,
      dto.lessonId,
      dto.description,
      dto.maxAttempts,
      dto.timeLimit,
      dto.passScore,
    );
    const result = await this.commandBus.execute<
      CreateAssessmentCommand,
      CreateAssessmentResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getAssessmentsByCourse',
    summary: 'Get assessments for a course',
  })
  @ApiOkResponseWrapped(AssessmentResponseDto, {
    description: 'Assessments returned.',
  })
  async getAssessments(
    @Param('courseId') courseId: string,
    @Query('lessonId') lessonId?: string,
  ) {
    const query = new GetAssessmentsQuery(courseId, lessonId);
    const result = await this.queryBus.execute<
      GetAssessmentsQuery,
      Assessment[]
    >(query);
    return BaseResponse.ok(result);
  }

  // ── Attempt ──

  @Post(':assessmentId/attempts')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'startAttempt',
    summary: 'Start a quiz/exam attempt',
  })
  @ApiCreatedResponseWrapped(StartAttemptResponseDto, {
    description: 'Attempt started. Returns randomized questions.',
  })
  async startAttempt(
    @CurrentUser() user: { userId: string },
    @Param('assessmentId') assessmentId: string,
  ): Promise<BaseResponse<any>> {
    const cmd = new StartAttemptCommand(user.userId, assessmentId);
    const result = await this.commandBus.execute<
      StartAttemptCommand,
      StartAttemptResult
    >(cmd);

    // Strip isCorrect from options before returning to student
    const sanitizedQuestions = result.questions.map((q) => ({
      id: q.question.id,
      type: q.question.type,
      difficulty: q.question.difficulty,
      content: q.question.content,
      options: q.question.options.map((o) => ({
        id: o.id,
        content: o.content,
        orderIndex: o.orderIndex,
      })),
      assignedPoints: q.assignedPoints,
    }));

    return BaseResponse.ok({
      attemptId: result.attemptId,
      questions: sanitizedQuestions,
    });
  }

  @Post('attempts/:attemptId/submit')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'submitAttempt',
    summary: 'Submit answers for an attempt',
  })
  @ApiOkResponseWrapped(SubmitAttemptResponseDto, {
    description: 'Attempt submitted and graded.',
  })
  async submitAttempt(
    @CurrentUser() user: { userId: string },
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitAttemptDto,
  ): Promise<BaseResponse<SubmitAttemptResult>> {
    const cmd = new SubmitAttemptCommand(user.userId, attemptId, dto.answers);
    const result = await this.commandBus.execute<
      SubmitAttemptCommand,
      SubmitAttemptResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  @Get('attempts/:attemptId/result')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getAttemptResult',
    summary: 'Get graded result of an attempt',
  })
  @ApiOkResponseWrapped(SubmitAttemptResponseDto, {
    description: 'Attempt result returned.',
  })
  async getAttemptResult(
    @CurrentUser() user: { userId: string },
    @Param('attemptId') attemptId: string,
  ) {
    const query = new GetAttemptResultQuery(attemptId, user.userId);
    const result = await this.queryBus.execute<
      GetAttemptResultQuery,
      AttemptWithQuestionsAndAnswers
    >(query);
    return BaseResponse.ok(result);
  }

  // ── Gradebook ──

  @Get('gradebook/course/:courseId')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getGradebook',
    summary: 'Get student gradebook for a course',
  })
  @ApiOkResponseWrapped(GradebookResponseDto, {
    description: 'Gradebook returned.',
  })
  async getGradebook(
    @CurrentUser() user: { userId: string },
    @Param('courseId') courseId: string,
  ) {
    const query = new GetGradebookQuery(user.userId, courseId);
    const result = await this.queryBus.execute<
      GetGradebookQuery,
      GradebookRecord[]
    >(query);
    return BaseResponse.ok(result);
  }
}
