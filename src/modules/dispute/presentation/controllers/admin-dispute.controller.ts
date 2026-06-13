import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiOkResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { ResolveDisputeCommand } from '../../application/commands/resolve-dispute/resolve-dispute.command';
import { ResolveDisputeResult } from '../../application/commands/resolve-dispute/resolve-dispute.result';
import {
  ResolveDisputeDto,
  ResolveDisputeResponseDto,
} from '../schemas/dispute.dto';

@ApiTags('Admin Dispute')
@Controller('admin/disputes')
export class AdminDisputeController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/resolve')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'resolveDispute',
    summary: 'Resolve a dispute ticket',
    description:
      'Allows admin to resolve a dispute ticket with REFUND or REJECT resolution.',
  })
  @ApiOkResponseWrapped(ResolveDisputeResponseDto, {
    description: 'Dispute ticket resolved successfully.',
  })
  async resolveDispute(
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ): Promise<BaseResponse<ResolveDisputeResponseDto>> {
    const result = await this.commandBus.execute<
      ResolveDisputeCommand,
      ResolveDisputeResult
    >(new ResolveDisputeCommand(id, dto.resolution));

    return BaseResponse.ok(ResolveDisputeResponseDto.fromResult(result));
  }
}
