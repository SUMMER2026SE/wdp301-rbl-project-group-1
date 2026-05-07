import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { Subject } from '../../../domain/entities/subject.entity';
import { ISubjectRepository } from '../../../domain/repositories/subject.repository.interface';
import { CreateSubjectCommand } from './create-subject.command';
import { CreateSubjectResult } from './create-subject.result';

@CommandHandler(CreateSubjectCommand)
export class CreateSubjectCommandHandler
  implements
    ICommandHandler<CreateSubjectCommand>,
    ICommand<CreateSubjectCommand, CreateSubjectResult>
{
  constructor(
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
  ) {}

  async execute(command: CreateSubjectCommand): Promise<CreateSubjectResult> {
    const subject = Subject.create('', {
      name: command.name,
      slug: command.slug,
      createdAt: new Date(),
    });

    const savedSubject = await this.subjectRepository.create(subject);

    return new CreateSubjectResult(
      savedSubject.id,
      savedSubject.name,
      savedSubject.slug,
    );
  }
}
