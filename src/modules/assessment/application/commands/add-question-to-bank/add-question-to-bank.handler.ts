import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { Question } from '../../../domain/entities/question.entity';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { AddQuestionToBankCommand } from './add-question-to-bank.command';
import { AddQuestionToBankResult } from './add-question-to-bank.result';

@CommandHandler(AddQuestionToBankCommand)
export class AddQuestionToBankCommandHandler
  implements
    ICommandHandler<AddQuestionToBankCommand>,
    ICommand<AddQuestionToBankCommand, AddQuestionToBankResult>
{
  private readonly logger = new Logger(AddQuestionToBankCommandHandler.name);

  constructor(
    @Inject(IQuestionBankRepository)
    private readonly questionBankRepository: IQuestionBankRepository,
  ) {}

  async execute(
    command: AddQuestionToBankCommand,
  ): Promise<AddQuestionToBankResult> {
    // Validate bank exists
    const bank = await this.questionBankRepository.findById(command.bankId);
    if (!bank) {
      throw new NotFoundException(`Question bank ${command.bankId} not found`);
    }

    const id = randomUUID();

    const question = Question.create(id, {
      bankId: command.bankId,
      type: command.type,
      difficulty: command.difficulty,
      content: command.content,
      points: command.points,
      orderIndex: command.orderIndex,
      options: command.options.map((o) => ({
        id: randomUUID(),
        content: o.content,
        isCorrect: o.isCorrect,
        orderIndex: o.orderIndex,
      })),
    });

    const saved = await this.questionBankRepository.addQuestion(question);
    this.logger.log(`Question added to bank ${command.bankId}: ${saved.id}`);

    return new AddQuestionToBankResult(saved.id);
  }
}
