import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryResult } from '../../../../shared/domain/common/query';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateResourceCommand } from '../../application/commands/create-resource/create-resource.command';
import { CreateResourceResult } from '../../application/commands/create-resource/create-resource.result';
import { UpdateResourceCommand } from '../../application/commands/update-resource/update-resource.command';
import { UpdateResourceResult } from '../../application/commands/update-resource/update-resource.result';
import { GetAllResourcesQuery } from '../../application/queries/get-all-resources/get-all-resources.query';
import { GetAllResourcesResult } from '../../application/queries/get-all-resources/get-all-resources.result';
import { GetResourceByIdQuery } from '../../application/queries/get-resource-by-id/get-resource-by-id.query';
import { GetResourceByIdResult } from '../../application/queries/get-resource-by-id/get-resource-by-id.result';
import { GetResourcesByTargetQuery } from '../../application/queries/get-resources-by-target/get-resources-by-target.query';
import { GetResourcesByTargetResult } from '../../application/queries/get-resources-by-target/get-resources-by-target.result';
import { GetResourcesByTutorQuery } from '../../application/queries/get-resources-by-tutor/get-resources-by-tutor.query';
import { ResourceByTutorResultData } from '../../application/queries/get-resources-by-tutor/get-resources-by-tutor.result';
import {
  AssignTarget,
  ResourcePaginatedParams,
} from '../../domain/repositories/resource.repository.interface';
import { CreateResourceDto } from '../schemas/create-resource.dto';
import { GetResourcesByTargetQueryDto } from '../schemas/get-resources-by-target-query.dto';
import {
  GetResourcesByTutorQueryDto,
  GetResourcesByTutorQueryParams,
} from '../schemas/get-resources-by-tutor-query.dto';
import {
  CreateResourceResultDto,
  ResourceResponseDto,
  UpdateResourceResultDto,
} from '../schemas/resource-response.dto';
import { UpdateResourceDto } from '../schemas/update-resource.dto';

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

  @Put('update')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'updateResource',
    summary: 'Assign, unassign, or replace resources on a target',
    description:
      'Unified endpoint for resource management. Use action=ASSIGN to attach resources, action=UNASSIGN to detach, or action=REPLACE to remove all current assignments and attach the given ones.',
  })
  @ApiOkResponseWrapped(UpdateResourceResultDto, {
    description: 'Resource operation completed successfully.',
  })
  async updateResource(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateResourceDto,
  ): Promise<BaseResponse<UpdateResourceResult>> {
    const result = await this.commandBus.execute<
      UpdateResourceCommand,
      UpdateResourceResult
    >(
      new UpdateResourceCommand(
        user.userId,
        dto.action,
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

  @Get('tutor/:tutorId')
  @Public()
  @ApiOperation({
    operationId: 'getResourcesByTutor',
    summary: 'Get paginated resources uploaded by a tutor',
  })
  @ApiOkResponseQueryWrapped(ResourceResponseDto, {
    description: 'Paginated resources for the tutor.',
  })
  async getResourcesByTutor(
    @Param('tutorId') tutorId: string,
    @Query() dto: GetResourcesByTutorQueryDto,
  ) {
    const query: GetResourcesByTutorQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params: ResourcePaginatedParams = {
      userId: tutorId,
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await this.queryBus.execute<
      GetResourcesByTutorQuery,
      QueryResult<ResourceByTutorResultData>
    >(new GetResourcesByTutorQuery(params));

    return QueryResponse.query(result);
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
