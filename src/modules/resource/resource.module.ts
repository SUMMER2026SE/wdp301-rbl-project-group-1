import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateResourceCommandHandler } from './application/commands/create-resource/create-resource.handler';
import { DeleteResourceCommandHandler } from './application/commands/delete-resource/delete-resource.handler';
import { UpdateResourceCommandHandler } from './application/commands/update-resource/update-resource.handler';
import { GetAllResourcesQueryHandler } from './application/queries/get-all-resources/get-all-resources.handler';
import { GetResourceByIdQueryHandler } from './application/queries/get-resource-by-id/get-resource-by-id.handler';
import { GetResourcesByTargetQueryHandler } from './application/queries/get-resources-by-target/get-resources-by-target.handler';
import { GetResourcesByTutorQueryHandler } from './application/queries/get-resources-by-tutor/get-resources-by-tutor.handler';
import { IResourceRepository } from './domain/repositories/resource.repository.interface';
import { PrismaResourceRepository } from './infrastructure/repositories/resource.repository.impl';
import { ResourceController } from './presentation/controllers/resource.controller';

const CommandHandlers = [
  CreateResourceCommandHandler,
  DeleteResourceCommandHandler,
  UpdateResourceCommandHandler,
];

const QueryHandlers = [
  GetAllResourcesQueryHandler,
  GetResourceByIdQueryHandler,
  GetResourcesByTargetQueryHandler,
  GetResourcesByTutorQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ResourceController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: IResourceRepository,
      useClass: PrismaResourceRepository,
    },
  ],
  exports: [IResourceRepository],
})
export class ResourceModule {}
