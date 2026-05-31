import { Controller, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiOkResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { AcceptBookingCommand } from '../../application/commands/accept-booking/accept-booking.command';
import { AcceptBookingResult } from '../../application/commands/accept-booking/accept-booking.result';
import { RejectBookingCommand } from '../../application/commands/reject-booking/reject-booking.command';
import { RejectBookingResult } from '../../application/commands/reject-booking/reject-booking.result';
import { BookingStatusUpdateResponseDto } from '../schemas/booking-response.dto';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/accept')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'acceptBooking',
    summary: 'Accept a pending booking',
  })
  @ApiOkResponseWrapped(BookingStatusUpdateResponseDto, {
    description: 'Booking accepted successfully.',
  })
  async acceptBooking(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<BaseResponse<BookingStatusUpdateResponseDto>> {
    const result = await this.commandBus.execute<
      AcceptBookingCommand,
      AcceptBookingResult
    >(new AcceptBookingCommand(id, user.userId));

    return BaseResponse.ok(BookingStatusUpdateResponseDto.fromResult(result));
  }

  @Patch(':id/reject')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'rejectBooking',
    summary: 'Reject a pending booking',
  })
  @ApiOkResponseWrapped(BookingStatusUpdateResponseDto, {
    description: 'Booking rejected successfully.',
  })
  async rejectBooking(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<BaseResponse<BookingStatusUpdateResponseDto>> {
    const result = await this.commandBus.execute<
      RejectBookingCommand,
      RejectBookingResult
    >(new RejectBookingCommand(id, user.userId));

    return BaseResponse.ok(BookingStatusUpdateResponseDto.fromResult(result));
  }
}
