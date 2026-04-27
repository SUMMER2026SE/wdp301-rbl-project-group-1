import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Grade } from '../../../domain/entities/grade.entity';
import { IGradeRepository } from '../../../domain/repositories/grade.repository.interface';
import { CreateGradeCommand } from './create-grade.command';
import { CreateGradeResult } from './create-grade.result';

@CommandHandler(CreateGradeCommand)
export class CreateGradeCommandHandler implements ICommandHandler<CreateGradeCommand> {
  constructor(
    @Inject(IGradeRepository)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(command: CreateGradeCommand): Promise<CreateGradeResult> {
    const id = randomUUID();

    const grade = Grade.create(id, {
      name: command.name,
      slug: command.slug,
      order: command.order,
      createdAt: new Date(),
    });

    const savedGrade = await this.gradeRepository.create(grade);

    return new CreateGradeResult(
      savedGrade.id,
      savedGrade.name,
      savedGrade.slug,
      savedGrade.order,
      savedGrade.createdAt,
    );
  }
}
