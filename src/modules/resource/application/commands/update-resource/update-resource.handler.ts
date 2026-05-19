import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { IUnitOfWork } from '../../../../../shared/application/interfaces/unit-of-work';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { Resource } from '../../../domain/entities/resource.entity';
import { IResourceRepository } from '../../../domain/repositories/resource.repository.interface';
import { ResourceType } from '../../../domain/value-objects/resource-type';
import { UpdateResourceCommand } from './update-resource.command';
import { UpdateResourceResult } from './update-resource.result';

@CommandHandler(UpdateResourceCommand)
export class UpdateResourceCommandHandler
  implements
    ICommandHandler<UpdateResourceCommand>,
    ICommand<UpdateResourceCommand, UpdateResourceResult>
{
  constructor(
    @Inject(IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
    @Inject(IUnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(command: UpdateResourceCommand): Promise<UpdateResourceResult> {
    const existingIds = command.resourceIds ?? [];
    const newResources = command.resources ?? [];

    switch (command.action) {
      case 'UNASSIGN':
        return this.handleUnassign(command, existingIds);
      case 'ASSIGN':
        return this.handleAssign(command, existingIds, newResources);
      case 'REPLACE':
        return this.handleReplace(command, existingIds, newResources);
      default:
        throw new BadRequestException(
          `Unknown action: ${String(command.action)}`,
        );
    }
  }

  // ── UNASSIGN ────────────────────────────────────────────────────────
  private async handleUnassign(
    command: UpdateResourceCommand,
    resourceIds: string[],
  ): Promise<UpdateResourceResult> {
    if (resourceIds.length === 0) {
      throw new BadRequestException(
        'At least one resourceId must be provided for UNASSIGN',
      );
    }

    let removedCount: number;

    if (command.targetType === 'COURSE') {
      removedCount = await this.resourceRepository.unassignFromCourse(
        resourceIds,
        command.targetId,
      );
    } else {
      removedCount = await this.resourceRepository.unassignFromLesson(
        resourceIds,
        command.targetId,
      );
    }

    return new UpdateResourceResult([], removedCount);
  }

  // ── ASSIGN ──────────────────────────────────────────────────────────
  private async handleAssign(
    command: UpdateResourceCommand,
    existingIds: string[],
    newResources: UpdateResourceCommand['resources'] & {},
  ): Promise<UpdateResourceResult> {
    if (existingIds.length === 0 && newResources.length === 0) {
      throw new BadRequestException(
        'At least one resourceId or resource data must be provided for ASSIGN',
      );
    }

    // Validate existing resource IDs before entering the transaction
    await this.validateResourceIds(existingIds);

    return this.unitOfWork.execute(async () => {
      const assignedIds = await this.createAndCollectIds(
        command.userId,
        existingIds,
        newResources,
      );

      await this.assignAll(assignedIds, command);

      return new UpdateResourceResult(assignedIds);
    });
  }

  // ── REPLACE ─────────────────────────────────────────────────────────
  private async handleReplace(
    command: UpdateResourceCommand,
    existingIds: string[],
    newResources: UpdateResourceCommand['resources'] & {},
  ): Promise<UpdateResourceResult> {
    // Validate existing resource IDs before entering the transaction
    await this.validateResourceIds(existingIds);

    return this.unitOfWork.execute(async () => {
      // 1. Remove all current assignments for this target
      if (command.targetType === 'COURSE') {
        // For courses we don't currently have removeAllFromCourse,
        // but we can unassign all existing resources first.
        // Fetch current resources for the target and unassign them.
        const currentResources = await this.resourceRepository.findByTarget(
          command.targetType,
          command.targetId,
        );
        if (currentResources.length > 0) {
          await this.resourceRepository.unassignFromCourse(
            currentResources.map((r) => r.id),
            command.targetId,
          );
        }
      } else {
        await this.resourceRepository.removeAllFromLesson(command.targetId);
      }

      // 2. Create new resources and collect all IDs
      const assignedIds = await this.createAndCollectIds(
        command.userId,
        existingIds,
        newResources,
      );

      // 3. Re-assign all resources to the target
      await this.assignAll(assignedIds, command);

      return new UpdateResourceResult(assignedIds);
    });
  }

  // ── Shared helpers ──────────────────────────────────────────────────

  private async validateResourceIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      const existing = await this.resourceRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Resource with id ${id} not found`);
      }
    }
  }

  private async createAndCollectIds(
    userId: string,
    existingIds: string[],
    newResources: NonNullable<UpdateResourceCommand['resources']>,
  ): Promise<string[]> {
    const assignedIds: string[] = [...existingIds];

    for (const data of newResources) {
      const resourceType = ResourceType.create(data.type);
      const id = randomUUID();

      const newResource = Resource.create(id, {
        userId,
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

    return assignedIds;
  }

  private async assignAll(
    resourceIds: string[],
    command: UpdateResourceCommand,
  ): Promise<void> {
    for (const resourceId of resourceIds) {
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
  }
}
