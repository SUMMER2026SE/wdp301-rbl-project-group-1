import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { AssessmentType } from '../../../../../shared/domain/enums/enums';
import { Attempt } from '../../../domain/entities/attempt.entity';
import { Question } from '../../../domain/entities/question.entity';
import { IAssessmentRepository } from '../../../domain/repositories/assessment.repository.interface';
import { IAttemptRepository } from '../../../domain/repositories/attempt.repository.interface';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { IGradebookRepository } from '../../../domain/repositories/gradebook.repository.interface';
import { QuestionRandomizerService } from '../../../domain/services/question-randomizer.service';
import { StartAttemptCommand } from './start-attempt.command';
import { StartAttemptResult } from './start-attempt.result';

@CommandHandler(StartAttemptCommand)
export class StartAttemptCommandHandler
  implements
    ICommandHandler<StartAttemptCommand>,
    ICommand<StartAttemptCommand, StartAttemptResult>
{
  private readonly logger = new Logger(StartAttemptCommandHandler.name);

  constructor(
    @Inject(IAssessmentRepository)
    private readonly assessmentRepository: IAssessmentRepository,
    @Inject(IAttemptRepository)
    private readonly attemptRepository: IAttemptRepository,
    @Inject(IQuestionBankRepository)
    private readonly questionBankRepository: IQuestionBankRepository,
    @Inject(IGradebookRepository)
    private readonly gradebookRepository: IGradebookRepository,
  ) {}

  async execute(command: StartAttemptCommand): Promise<StartAttemptResult> {
    // 1. Validate assessment
    const assessment = await this.assessmentRepository.findById(
      command.assessmentId,
    );
    if (!assessment) {
      throw new NotFoundException(
        `Assessment ${command.assessmentId} not found`,
      );
    }

    // 2. Exam eligibility: student must have passed all lesson quizzes
    if (assessment.type === AssessmentType.EXAM) {
      await this.validateExamEligibility(
        command.studentId,
        assessment.courseId,
      );
    }

    // 3. Check max attempts
    if (assessment.maxAttempts) {
      const attemptCount =
        await this.attemptRepository.countByStudentAndAssessment(
          command.studentId,
          command.assessmentId,
        );
      if (attemptCount >= assessment.maxAttempts) {
        throw new BadRequestException('Max attempts reached');
      }
    }

    // 4. Fetch bank configs and their questions
    const bankConfigs =
      await this.assessmentRepository.findBankConfigsByAssessmentId(
        command.assessmentId,
      );

    const bankQuestionsMap = new Map<string, Question[]>();
    for (const config of bankConfigs) {
      if (!bankQuestionsMap.has(config.bankId)) {
        const result = await this.questionBankRepository.findQuestionsByBankId({
          bankId: config.bankId,
          skip: 0,
          limit: 1000, // Fetch all questions from bank
          page: 1,
        });
        bankQuestionsMap.set(config.bankId, result.data);
      }
    }

    // 5. Randomize questions
    const randomized = QuestionRandomizerService.randomize(
      bankConfigs,
      bankQuestionsMap,
      assessment.isRandomized,
      assessment.shuffleOptions,
    );

    // 6. Create attempt
    const attemptId = randomUUID();
    const attempt = Attempt.create(attemptId, {
      assessmentId: command.assessmentId,
      studentId: command.studentId,
      startTime: new Date(),
    });

    await this.attemptRepository.create(attempt);
    this.logger.log(`Attempt started: ${attemptId}`);

    return new StartAttemptResult(attemptId, randomized);
  }

  /**
   * Validates that the student has passed all lesson quizzes in the course.
   */
  private async validateExamEligibility(
    studentId: string,
    courseId: string,
  ): Promise<void> {
    // Get all assessments for this course
    const allAssessments =
      await this.assessmentRepository.findByCourseId(courseId);

    // Filter lesson quizzes (have lessonId and type QUIZ)
    const lessonQuizzes = allAssessments.filter(
      (a) => a.lessonId && a.type === AssessmentType.QUIZ,
    );

    if (lessonQuizzes.length === 0) return;

    // Check if student has passed all quizzes
    for (const quiz of lessonQuizzes) {
      const gradebook =
        await this.gradebookRepository.findByStudentAndAssessment(
          studentId,
          quiz.id,
        );

      if (!gradebook || !gradebook.isPassed) {
        throw new ForbiddenException(
          `Student must pass all lesson quizzes before taking the exam. Quiz "${quiz.title}" not passed.`,
        );
      }
    }
  }
}
