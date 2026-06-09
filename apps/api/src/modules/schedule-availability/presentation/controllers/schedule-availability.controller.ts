import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { UpdateScheduleAvailabilityCommand } from '../../application/commands/update-schedule-availability/update-schedule-availability.command';
import { UpdateScheduleAvailabilityResult } from '../../application/commands/update-schedule-availability/update-schedule-availability.result';
import { GetScheduleAvailabilityQuery } from '../../application/queries/get-schedule-availability/get-schedule-availability.query';
import { GetScheduleAvailabilityResult } from '../../application/queries/get-schedule-availability/get-schedule-availability.result';
import {
  ScheduleAvailabilityResponseDto,
  UpdateScheduleAvailabilityDto,
} from '../schemas/schedule-availability.dto';

@ApiTags('Schedule Availability')
@Controller('schedule-availability')
export class ScheduleAvailabilityController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getScheduleAvailability',
    summary: 'Get current user schedule availability',
  })
  @ApiOkResponseWrapped(ScheduleAvailabilityResponseDto, {
    description: 'Schedule availability returned successfully.',
  })
  async getScheduleAvailability(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<GetScheduleAvailabilityResult>> {
    const result = await this.queryBus.execute<
      GetScheduleAvailabilityQuery,
      GetScheduleAvailabilityResult
    >(new GetScheduleAvailabilityQuery(user.userId));

    return BaseResponse.ok(result);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'updateScheduleAvailability',
    summary: 'Replace current user schedule availability',
  })
  @ApiOkResponseWrapped(ScheduleAvailabilityResponseDto, {
    description: 'Schedule availability updated successfully.',
  })
  async updateScheduleAvailability(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateScheduleAvailabilityDto,
  ): Promise<BaseResponse<UpdateScheduleAvailabilityResult>> {
    const result = await this.commandBus.execute<
      UpdateScheduleAvailabilityCommand,
      UpdateScheduleAvailabilityResult
    >(new UpdateScheduleAvailabilityCommand(user.userId, dto.availability));

    return BaseResponse.ok(result);
  }
}
