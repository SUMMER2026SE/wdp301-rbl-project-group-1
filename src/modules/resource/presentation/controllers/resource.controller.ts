import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { AssignResourceCommand } from '../../application/commands/assign-resource/assign-resource.command';
import { AssignResourceResult } from '../../application/commands/assign-resource/assign-resource.result';
import { CreateResourceCommand } from '../../application/commands/create-resource/create-resource.command';
import { CreateResourceResult } from '../../application/commands/create-resource/create-resource.result';
import { AssignResourceDto } from '../schemas/assign-resource.dto';
import { CreateResourceDto } from '../schemas/create-resource.dto';
import {
  AssignResourceResultDto,
  CreateResourceResultDto,
} from '../schemas/resource-response.dto';

@ApiTags('Resource')
@Controller('resources')
export class ResourceController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createResource',
    summary: 'Create a new resource',
  })
  @ApiCreatedResponseWrapped(CreateResourceResultDto, {
    description: 'Resource successfully created.',
  })
  async createResource(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateResourceDto,
  ): Promise<BaseResponse<CreateResourceResult>> {
    const result = await this.commandBus.execute<
      CreateResourceCommand,
      CreateResourceResult
    >(
      new CreateResourceCommand(
        user.userId,
        dto.name,
        dto.url,
        dto.type,
        dto.size,
      ),
    );
    return BaseResponse.ok(result);
  }

  @Post('assign')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'assignResource',
    summary: 'Assign a resource to a course or lesson',
    description:
      'Assign an existing resource by resourceId, or provide new resource data to create and assign in one step.',
  })
  @ApiCreatedResponseWrapped(AssignResourceResultDto, {
    description: 'Resource successfully assigned.',
  })
  async assignResource(
    @CurrentUser() user: { userId: string },
    @Body() dto: AssignResourceDto,
  ): Promise<BaseResponse<AssignResourceResult>> {
    const result = await this.commandBus.execute<
      AssignResourceCommand,
      AssignResourceResult
    >(
      new AssignResourceCommand(
        user.userId,
        dto.targetType,
        dto.targetId,
        dto.resourceIds,
        dto.resources,
      ),
    );
    return BaseResponse.ok(result);
  }
}
