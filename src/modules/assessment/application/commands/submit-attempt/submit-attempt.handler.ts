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
import {
  GradingPolicy,
  QuestionType,
} from '../../../../../shared/domain/enums/enums';
import { AttemptAnswer } from '../../../domain/entities/attempt-answer.entity';
import { GradebookRecord } from '../../../domain/entities/gradebook-record.entity';
import { IAssessmentRepository } from '../../../domain/repositories/assessment.repository.interface';
import { IAttemptRepository } from '../../../domain/repositories/attempt.repository.interface';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { IGradebookRepository } from '../../../domain/repositories/gradebook.repository.interface';
import { SubmitAttemptCommand } from './submit-attempt.command';
import { SubmitAttemptResult } from './submit-attempt.result';

@CommandHandler(SubmitAttemptCommand)
export class SubmitAttemptCommandHandler
  implements
    ICommandHandler<SubmitAttemptCommand>,
    ICommand<SubmitAttemptCommand, SubmitAttemptResult>
{
  private readonly logger = new Logger(SubmitAttemptCommandHandler.name);

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

  async execute(command: SubmitAttemptCommand): Promise<SubmitAttemptResult> {
    // 1. Validate attempt
    const attempt = await this.attemptRepository.findById(command.attemptId);
    if (!attempt) {
      throw new NotFoundException(`Attempt ${command.attemptId} not found`);
    }

    if (attempt.studentId !== command.studentId) {
      throw new ForbiddenException('You do not own this attempt');
    }

    if (attempt.endTime) {
      throw new BadRequestException('Attempt already submitted');
    }

    // 2. Get assessment
    const assessment = await this.assessmentRepository.findById(
      attempt.assessmentId,
    );
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    // 3. Grade each answer (skip TEXT_ANSWER)
    let totalPoints = 0;
    let earnedPoints = 0;
    const gradedAnswers: AttemptAnswer[] = [];

    for (const answerInput of command.answers) {
      const question = await this.questionBankRepository.findQuestionById(
        answerInput.questionId,
      );

      if (!question) {
        this.logger.warn(
          `Question ${answerInput.questionId} not found, skipping`,
        );
        continue;
      }

      // Skip TEXT_ANSWER from automated grading
      if (question.type === QuestionType.TEXT_ANSWER) {
        gradedAnswers.push(
          AttemptAnswer.create(randomUUID(), {
            attemptId: command.attemptId,
            questionId: answerInput.questionId,
            optionIds: [],
            textAnswer: answerInput.textAnswer,
            isCorrect: null,
            points: null,
          }),
        );
        continue;
      }

      // Get correct option IDs
      const correctOptionIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);

      // Check if student's answer matches
      const studentOptionIds = [...answerInput.optionIds].sort();
      const sortedCorrect = [...correctOptionIds].sort();
      const isCorrect =
        studentOptionIds.length === sortedCorrect.length &&
        studentOptionIds.every((id, i) => id === sortedCorrect[i]);

      const pointsAwarded = isCorrect ? question.points : 0;
      totalPoints += question.points;
      earnedPoints += pointsAwarded;

      gradedAnswers.push(
        AttemptAnswer.create(randomUUID(), {
          attemptId: command.attemptId,
          questionId: answerInput.questionId,
          optionIds: answerInput.optionIds,
          textAnswer: answerInput.textAnswer,
          isCorrect,
          points: pointsAwarded,
        }),
      );
    }

    // 4. Calculate score percentage
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = assessment.passScore
      ? score >= assessment.passScore
      : true;

    // 5. Update attempt
    attempt.submit(score, isPassed);

    await this.attemptRepository.submitAttempt(attempt, gradedAnswers);

    // 6. Update gradebook
    await this.updateGradebook(
      command.studentId,
      assessment.id,
      assessment.courseId,
      assessment.gradingPolicy,
      command.attemptId,
      score,
      isPassed,
    );

    this.logger.log(
      `Attempt ${command.attemptId} submitted. Score: ${score.toFixed(1)}% (${isPassed ? 'PASSED' : 'FAILED'})`,
    );

    return new SubmitAttemptResult(
      command.attemptId,
      Math.round(score * 100) / 100,
      isPassed,
      totalPoints,
      earnedPoints,
    );
  }

  private async updateGradebook(
    studentId: string,
    assessmentId: string,
    courseId: string,
    gradingPolicy: GradingPolicy,
    attemptId: string,
    score: number,
    isPassed: boolean,
  ): Promise<void> {
    const existing = await this.gradebookRepository.findByStudentAndAssessment(
      studentId,
      assessmentId,
    );

    let finalScore = score;
    let finalPassed = isPassed;
    let bestAttemptId = attemptId;

    if (existing) {
      switch (gradingPolicy) {
        case GradingPolicy.HIGHEST:
          if (score > existing.finalScore) {
            finalScore = score;
            bestAttemptId = attemptId;
          } else {
            finalScore = existing.finalScore;
            bestAttemptId = existing.bestAttemptId ?? attemptId;
          }
          finalPassed = finalPassed || existing.isPassed;
          break;
        case GradingPolicy.LATEST:
          // Always use latest
          break;
        case GradingPolicy.AVERAGE: {
          const allAttempts =
            await this.attemptRepository.findByStudentAndAssessment(
              studentId,
              assessmentId,
            );
          const totalScore = allAttempts.reduce(
            (sum, a) => sum + (a.score ?? 0),
            0,
          );
          finalScore = totalScore / allAttempts.length;
          finalPassed =
            finalScore >= (existing.finalScore > 0 ? existing.finalScore : 0);
          break;
        }
      }
    }

    const record = GradebookRecord.create(existing?.id ?? randomUUID(), {
      studentId,
      courseId,
      assessmentId,
      finalScore,
      isPassed: finalPassed,
      bestAttemptId,
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    });

    await this.gradebookRepository.upsert(record);
  }
}
