import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { DisputeSessionCommand } from '../../application/commands/dispute-session/dispute-session.command';
import { DisputeSessionResult } from '../../application/commands/dispute-session/dispute-session.result';
import {
  DisputeSessionDto,
  DisputeSessionResponseDto,
} from '../schemas/dispute-session.dto';

@ApiTags('Session')
@Controller('sessions')
export class DisputeSessionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':sessionId/dispute')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'disputeSession',
    summary: 'Student disputes a session',
    description:
      'Allows a student to report a problematic session (e.g. tutor did not show up or taught fewer hours) and creates a dispute ticket.',
  })
  @ApiCreatedResponseWrapped(DisputeSessionResponseDto, {
    description: 'Dispute ticket created successfully.',
  })
  async disputeSession(
    @CurrentUser() user: { userId: string },
    @Param('sessionId') sessionId: string,
    @Body() dto: DisputeSessionDto,
  ): Promise<BaseResponse<DisputeSessionResponseDto>> {
    const result = await this.commandBus.execute<
      DisputeSessionCommand,
      DisputeSessionResult
    >(new DisputeSessionCommand(sessionId, user.userId, dto.reason));

    return BaseResponse.created(DisputeSessionResponseDto.fromResult(result));
  }
}
