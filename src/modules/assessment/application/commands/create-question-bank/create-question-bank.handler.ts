import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { QuestionBank } from '../../../domain/entities/question-bank.entity';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { CreateQuestionBankCommand } from './create-question-bank.command';
import { CreateQuestionBankResult } from './create-question-bank.result';

@CommandHandler(CreateQuestionBankCommand)
export class CreateQuestionBankCommandHandler
  implements
    ICommandHandler<CreateQuestionBankCommand>,
    ICommand<CreateQuestionBankCommand, CreateQuestionBankResult>
{
  private readonly logger = new Logger(CreateQuestionBankCommandHandler.name);

  constructor(
    @Inject(IQuestionBankRepository)
    private readonly questionBankRepository: IQuestionBankRepository,
  ) {}

  async execute(
    command: CreateQuestionBankCommand,
  ): Promise<CreateQuestionBankResult> {
    const id = randomUUID();
    const now = new Date();

    const bank = QuestionBank.create(id, {
      courseId: command.courseId,
      title: command.title,
      description: command.description,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.questionBankRepository.create(bank);
    this.logger.log(`Question bank created: ${saved.id}`);

    return new CreateQuestionBankResult(saved.id);
  }
}
