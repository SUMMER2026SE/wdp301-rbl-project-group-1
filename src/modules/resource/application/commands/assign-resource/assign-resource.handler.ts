import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { Resource } from '../../../domain/entities/resource.entity';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { ResourceType } from '../../../domain/value-objects/resource-type';
import { AssignResourceCommand } from './assign-resource.command';
import { AssignResourceResult } from './assign-resource.result';

@CommandHandler(AssignResourceCommand)
export class AssignResourceCommandHandler
  implements
    ICommandHandler<AssignResourceCommand>,
    ICommand<AssignResourceCommand, AssignResourceResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async execute(command: AssignResourceCommand): Promise<AssignResourceResult> {
    const existingIds = command.resourceIds ?? [];
    const newResources = command.resources ?? [];

    if (existingIds.length === 0 && newResources.length === 0) {
      throw new BadRequestException(
        'At least one resourceId or resource data must be provided',
      );
    }

    const assignedIds: string[] = [];

    // Validate and collect existing resources
    for (const id of existingIds) {
      const existing = await this.resourceRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Resource with id ${id} not found`);
      }
      assignedIds.push(existing.id);
    }

    // Create new resources
    for (const data of newResources) {
      const resourceType = ResourceType.create(data.type);
      const id = randomUUID();

      const newResource = Resource.create(id, {
        userId: command.userId,
        name: data.name,
        url: data.url,
        type: resourceType,
        size: data.size,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const saved = await this.resourceRepository.create(newResource);
      assignedIds.push(saved.id);
    }

    // Assign all to target
    for (const resourceId of assignedIds) {
      if (command.targetType === 'COURSE') {
        await this.resourceRepository.assignToCourse(
          resourceId,
          command.targetId,
        );
      } else {
        await this.resourceRepository.assignToLesson(
          resourceId,
          command.targetId,
        );
      }
    }

    return new AssignResourceResult(assignedIds);
  }
}
