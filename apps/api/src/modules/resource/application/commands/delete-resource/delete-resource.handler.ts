import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { DeleteResourceCommand } from './delete-resource.command';
import { DeleteResourceResult } from './delete-resource.result';

@CommandHandler(DeleteResourceCommand)
export class DeleteResourceCommandHandler
  implements
    ICommandHandler<DeleteResourceCommand>,
    ICommand<DeleteResourceCommand, DeleteResourceResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(command: DeleteResourceCommand): Promise<DeleteResourceResult> {
    const deleted = await this.resourceRepository.softDelete(
      command.resourceId,
      command.userId,
    );

    if (!deleted) {
      throw new NotFoundException(
        `Resource with id ${command.resourceId} not found`,
      );
    }

    return new DeleteResourceResult(command.resourceId);
  }
}
