import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { Resource } from '../../../domain/entities/resource.entity';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { ResourceType } from '../../../domain/value-objects/resource-type';
import { CreateResourceCommand } from './create-resource.command';
import { CreateResourceResult } from './create-resource.result';

@CommandHandler(CreateResourceCommand)
export class CreateResourceCommandHandler
  implements
    ICommandHandler<CreateResourceCommand>,
    ICommand<CreateResourceCommand, CreateResourceResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(command: CreateResourceCommand): Promise<CreateResourceResult> {
    const resourceType = ResourceType.create(command.type);
    const id = randomUUID();

    const resource = Resource.create(id, {
      userId: command.userId,
      name: command.name,
      url: command.url,
      type: resourceType,
      size: command.size,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedResource = await this.resourceRepository.create(resource);

    return new CreateResourceResult(savedResource.id);
  }
}
