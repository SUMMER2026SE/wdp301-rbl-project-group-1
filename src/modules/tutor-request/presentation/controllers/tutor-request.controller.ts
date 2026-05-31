import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { AcceptTutorBidCommand } from '../../application/commands/accept-tutor-bid/accept-tutor-bid.command';
import { AcceptTutorBidResult } from '../../application/commands/accept-tutor-bid/accept-tutor-bid.result';
import { CreateTutorRequestCommand } from '../../application/commands/create-tutor-request/create-tutor-request.command';
import { CreateTutorRequestResult } from '../../application/commands/create-tutor-request/create-tutor-request.result';
import { SetTutorBidCommand } from '../../application/commands/set-tutor-bid/set-tutor-bid.command';
import { SetTutorBidResult } from '../../application/commands/set-tutor-bid/set-tutor-bid.result';
import {
  CreateTutorRequestDto,
  SetTutorBidDto,
} from '../schemas/tutor-request.dto';
import {
  AcceptTutorBidResponseDto,
  TutorBidResponseDto,
  TutorRequestResponseDto,
} from '../schemas/tutor-request-response.dto';

@ApiTags('Tutor Request')
@Controller('tutor-requests')
export class TutorRequestController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createTutorRequest',
    summary: 'Create a tutor hiring request',
  })
  @ApiCreatedResponseWrapped(TutorRequestResponseDto, {
    description: 'Tutor request created successfully.',
  })
  async createTutorRequest(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateTutorRequestDto,
  ): Promise<BaseResponse<TutorRequestResponseDto>> {
    const result = await this.commandBus.execute<
      CreateTutorRequestCommand,
      CreateTutorRequestResult
    >(
      new CreateTutorRequestCommand(
        user.userId,
        dto.title,
        dto.description,
        dto.mode,
        dto.subjectId,
        dto.budget,
        dto.scheduleRules,
      ),
    );

    return BaseResponse.created(TutorRequestResponseDto.fromResult(result));
  }

  @Post(':id/bids')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'setTutorBid',
    summary: 'Create or update tutor bid on an open tutor request',
  })
  @ApiOkResponseWrapped(TutorBidResponseDto, {
    description: 'Tutor bid set successfully.',
  })
  async setTutorBid(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: SetTutorBidDto,
  ): Promise<BaseResponse<TutorBidResponseDto>> {
    const result = await this.commandBus.execute<
      SetTutorBidCommand,
      SetTutorBidResult
    >(new SetTutorBidCommand(id, user.userId, dto.proposedPrice, dto.message));

    return BaseResponse.ok(TutorBidResponseDto.fromResult(result));
  }

  @Patch(':requestId/bids/:bidId/accept')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'acceptTutorBid',
    summary: 'Accept a tutor bid and close the request',
  })
  @ApiOkResponseWrapped(AcceptTutorBidResponseDto, {
    description: 'Tutor bid accepted and request closed successfully.',
  })
  async acceptTutorBid(
    @CurrentUser() user: { userId: string },
    @Param('requestId') requestId: string,
    @Param('bidId') bidId: string,
  ): Promise<BaseResponse<AcceptTutorBidResponseDto>> {
    const result = await this.commandBus.execute<
      AcceptTutorBidCommand,
      AcceptTutorBidResult
    >(new AcceptTutorBidCommand(requestId, bidId, user.userId));

    return BaseResponse.ok(AcceptTutorBidResponseDto.fromResult(result));
  }
}
