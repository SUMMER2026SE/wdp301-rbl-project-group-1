import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { GetAllResourcesQuery } from '../../application/queries/get-all-resources/get-all-resources.query';
import { GetAllResourcesResult } from '../../application/queries/get-all-resources/get-all-resources.result';
import { GetResourceByIdQuery } from '../../application/queries/get-resource-by-id/get-resource-by-id.query';
import { GetResourceByIdResult } from '../../application/queries/get-resource-by-id/get-resource-by-id.result';
import { GetResourcesByTargetQuery } from '../../application/queries/get-resources-by-target/get-resources-by-target.query';
import { GetResourcesByTargetResult } from '../../application/queries/get-resources-by-target/get-resources-by-target.result';
import { AssignResourceCommand } from '../../application/commands/assign-resource/assign-resource.command';
import { AssignResourceResult } from '../../application/commands/assign-resource/assign-resource.result';
import { CreateResourceCommand } from '../../application/commands/create-resource/create-resource.command';
import { CreateResourceResult } from '../../application/commands/create-resource/create-resource.result';
import { AssignResourceDto } from '../schemas/assign-resource.dto';
import { CreateResourceDto } from '../schemas/create-resource.dto';
import { GetResourcesByTargetQueryDto } from '../schemas/get-resources-by-target-query.dto';
import {
  AssignResourceResultDto,
  CreateResourceResultDto,
  ResourceResponseDto,
} from '../schemas/resource-response.dto';
import { AssignTarget } from '../../domain/repositories/resource.repository.interface';

@ApiTags('Resource')
@Controller('resources')
export class ResourceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Get()
  @Public()
  @ApiOperation({
    operationId: 'getAllResources',
    summary: 'Get all resources',
  })
  @ApiOkResponseWrapped(ResourceResponseDto, {
    description: 'List of resources returned successfully.',
  })
  async getAllResources() {
    const result = await this.queryBus.execute<
      GetAllResourcesQuery,
      GetAllResourcesResult
    >(new GetAllResourcesQuery());
    return BaseResponse.ok(result);
  }

  @Get('target/:targetId')
  @Public()
  @ApiOperation({
    operationId: 'getResourcesByTarget',
    summary: 'Get resources by target (course or lesson)',
    description:
      'Returns all resources assigned to a specific course or lesson. Pass targetType as a query parameter.',
  })
  @ApiOkResponseWrapped(ResourceResponseDto, {
    description: 'Resources for the target returned successfully.',
  })
  async getResourcesByTarget(
    @Param('targetId') targetId: string,
    @Query() dto: GetResourcesByTargetQueryDto,
  ) {
    const result = await this.queryBus.execute<
      GetResourcesByTargetQuery,
      GetResourcesByTargetResult
    >(new GetResourcesByTargetQuery(dto.targetType as AssignTarget, targetId));
    return BaseResponse.ok(result);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    operationId: 'getResourceById',
    summary: 'Get a resource by ID',
  })
  @ApiOkResponseWrapped(ResourceResponseDto, {
    description: 'Resource returned successfully.',
  })
  async getResourceById(@Param('id') id: string) {
    const result = await this.queryBus.execute<
      GetResourceByIdQuery,
      GetResourceByIdResult
    >(new GetResourceByIdQuery(id));
    return BaseResponse.ok(result);
  }
}
