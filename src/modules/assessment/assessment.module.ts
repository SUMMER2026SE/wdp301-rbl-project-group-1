import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Command Handlers
import { AddQuestionToBankCommandHandler } from './application/commands/add-question-to-bank/add-question-to-bank.handler';
import { CreateAssessmentCommandHandler } from './application/commands/create-assessment/create-assessment.handler';
import { CreateQuestionBankCommandHandler } from './application/commands/create-question-bank/create-question-bank.handler';
import { ImportQuestionsFromExcelCommandHandler } from './application/commands/import-questions-from-excel/import-questions-from-excel.handler';
import { StartAttemptCommandHandler } from './application/commands/start-attempt/start-attempt.handler';
import { SubmitAttemptCommandHandler } from './application/commands/submit-attempt/submit-attempt.handler';

// Query Handlers
import { GetAssessmentsQueryHandler } from './application/queries/get-assessments/get-assessments.handler';
import { GetAttemptResultQueryHandler } from './application/queries/get-attempt-result/get-attempt-result.handler';
import { GetGradebookQueryHandler } from './application/queries/get-gradebook/get-gradebook.handler';
import { GetQuestionBanksQueryHandler } from './application/queries/get-question-banks/get-question-banks.handler';
import { GetQuestionsQueryHandler } from './application/queries/get-questions/get-questions.handler';

// Repository interfaces
import { IAssessmentRepository } from './domain/repositories/assessment.repository.interface';
import { IAttemptRepository } from './domain/repositories/attempt.repository.interface';
import { IGradebookRepository } from './domain/repositories/gradebook.repository.interface';
import { IQuestionBankRepository } from './domain/repositories/question-bank.repository.interface';

// Repository implementations
import { PrismaAssessmentRepository } from './infrastructure/repositories/prisma-assessment.repository';
import { PrismaAttemptRepository } from './infrastructure/repositories/prisma-attempt.repository';
import { PrismaGradebookRepository } from './infrastructure/repositories/prisma-gradebook.repository';
import { PrismaQuestionBankRepository } from './infrastructure/repositories/prisma-question-bank.repository';

// Controller
import { AssessmentController } from './presentation/controllers/assessment.controller';

const CommandHandlers = [
  CreateQuestionBankCommandHandler,
  AddQuestionToBankCommandHandler,
  CreateAssessmentCommandHandler,
  ImportQuestionsFromExcelCommandHandler,
  StartAttemptCommandHandler,
  SubmitAttemptCommandHandler,
];

const QueryHandlers = [
  GetQuestionBanksQueryHandler,
  GetQuestionsQueryHandler,
  GetAssessmentsQueryHandler,
  GetAttemptResultQueryHandler,
  GetGradebookQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [AssessmentController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: IQuestionBankRepository,
      useClass: PrismaQuestionBankRepository,
    },
    {
      provide: IAssessmentRepository,
      useClass: PrismaAssessmentRepository,
    },
    {
      provide: IAttemptRepository,
      useClass: PrismaAttemptRepository,
    },
    {
      provide: IGradebookRepository,
      useClass: PrismaGradebookRepository,
    },
  ],
  exports: [IAssessmentRepository, IGradebookRepository],
})
export class AssessmentModule {}
