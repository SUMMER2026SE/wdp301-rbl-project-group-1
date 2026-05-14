import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateResourceCommandHandler } from './application/commands/create-resource/create-resource.handler';
import { IResourceRepository } from './domain/repositories/resource.repository.interface';
import { PrismaResourceRepository } from './infrastructure/repositories/resource.repository.impl';
import { ResourceController } from './presentation/controllers/resource.controller';

const CommandHandlers = [CreateResourceCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ResourceController],
  providers: [
    ...CommandHandlers,
    {
      provide: IResourceRepository,
      useClass: PrismaResourceRepository,
    },
  ],
  exports: [IResourceRepository],
})
export class ResourceModule {}
