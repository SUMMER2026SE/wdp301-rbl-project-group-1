import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { Assessment } from '../../../domain/entities/assessment.entity';
import { AssessmentBankConfig } from '../../../domain/entities/assessment-bank-config.entity';
import { IAssessmentRepository } from '../../../domain/repositories/assessment.repository.interface';
import { CreateAssessmentCommand } from './create-assessment.command';
import { CreateAssessmentResult } from './create-assessment.result';

@CommandHandler(CreateAssessmentCommand)
export class CreateAssessmentCommandHandler
  implements
    ICommandHandler<CreateAssessmentCommand>,
    ICommand<CreateAssessmentCommand, CreateAssessmentResult>
{
  private readonly logger = new Logger(CreateAssessmentCommandHandler.name);

  constructor(
    @Inject(IAssessmentRepository)
    private readonly assessmentRepository: IAssessmentRepository,
  ) {}

  async execute(
    command: CreateAssessmentCommand,
  ): Promise<CreateAssessmentResult> {
    const id = randomUUID();
    const now = new Date();

    const assessment = Assessment.create(id, {
      courseId: command.courseId,
      lessonId: command.lessonId,
      title: command.title,
      description: command.description,
      type: command.type,
      maxAttempts: command.maxAttempts,
      timeLimit: command.timeLimit,
      isRandomized: command.isRandomized,
      shuffleOptions: command.shuffleOptions,
      antiCheat: command.antiCheat,
      passScore: command.passScore,
      gradingPolicy: command.gradingPolicy,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.assessmentRepository.create(assessment);

    // Create bank configs
    for (const config of command.bankConfigs) {
      const bankConfig = AssessmentBankConfig.create(randomUUID(), {
        assessmentId: saved.id,
        bankId: config.bankId,
        difficulty: config.difficulty,
        count: config.count,
        pointsPerQuestion: config.pointsPerQuestion,
      });
      await this.assessmentRepository.addBankConfig(bankConfig);
    }

    this.logger.log(`Assessment created: ${saved.id}`);

    return new CreateAssessmentResult(saved.id);
  }
}
