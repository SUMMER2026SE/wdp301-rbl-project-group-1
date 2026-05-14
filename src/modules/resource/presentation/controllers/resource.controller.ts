import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateResourceCommand } from '../../application/commands/create-resource/create-resource.command';
import { CreateResourceResult } from '../../application/commands/create-resource/create-resource.result';
import { CreateResourceDto } from '../schemas/create-resource.dto';
import { CreateResourceResultDto } from '../schemas/resource-response.dto';

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
}
