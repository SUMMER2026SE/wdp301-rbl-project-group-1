import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateDisputeCommand } from '../../application/commands/create-dispute/create-dispute.command';
import { CreateDisputeResult } from '../../application/commands/create-dispute/create-dispute.result';
import { SendDisputeMessageCommand } from '../../application/commands/send-dispute-message/send-dispute-message.command';
import { SendDisputeMessageResult } from '../../application/commands/send-dispute-message/send-dispute-message.result';
import {
  CreateDisputeDto,
  CreateDisputeResponseDto,
  SendDisputeMessageDto,
  SendDisputeMessageResponseDto,
} from '../schemas/dispute.dto';

@ApiTags('Dispute')
@Controller('disputes')
export class DisputeController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createDispute',
    summary: 'Create a dispute ticket',
    description:
      'Creates a dispute ticket associated with a booking or a session. Students and Tutors are allowed.',
  })
  @ApiCreatedResponseWrapped(CreateDisputeResponseDto, {
    description: 'Dispute ticket created successfully.',
  })
  async createDispute(
    @CurrentUser() user: { userId: string; role: 'STUDENT' | 'TUTOR' },
    @Body() dto: CreateDisputeDto,
  ): Promise<BaseResponse<CreateDisputeResponseDto>> {
    const result = await this.commandBus.execute<
      CreateDisputeCommand,
      CreateDisputeResult
    >(
      new CreateDisputeCommand(
        user.userId,
        dto.bookingId ?? null,
        dto.sessionId ?? null,
        dto.reason,
        user.role,
      ),
    );

    return BaseResponse.created(CreateDisputeResponseDto.fromResult(result));
  }

  @Post(':id/messages')
  @Roles(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'sendDisputeMessage',
    summary: 'Post a message in a dispute ticket chat',
    description:
      'Allows student, tutor, or admin to post messages to an active dispute ticket.',
  })
  @ApiCreatedResponseWrapped(SendDisputeMessageResponseDto, {
    description: 'Message posted successfully.',
  })
  async sendDisputeMessage(
    @CurrentUser()
    user: { userId: string; role: 'STUDENT' | 'TUTOR' | 'ADMIN' },
    @Param('id') id: string,
    @Body() dto: SendDisputeMessageDto,
  ): Promise<BaseResponse<SendDisputeMessageResponseDto>> {
    const result = await this.commandBus.execute<
      SendDisputeMessageCommand,
      SendDisputeMessageResult
    >(new SendDisputeMessageCommand(id, user.userId, user.role, dto.content));

    return BaseResponse.created(
      SendDisputeMessageResponseDto.fromResult(result),
    );
  }
}
