import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
  ApiOkResponseQueryWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import {
  QueryResponse,
  QueryApiResponse,
} from '../../../../shared/presentation/responses/query-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateDirectBookingCommand } from '../../application/commands/create-direct-booking/create-direct-booking.command';
import { CreateDirectBookingResult } from '../../application/commands/create-direct-booking/create-direct-booking.result';
import { AcceptBookingCommand } from '../../application/commands/accept-booking/accept-booking.command';
import { AcceptBookingResult } from '../../application/commands/accept-booking/accept-booking.result';
import { RejectBookingCommand } from '../../application/commands/reject-booking/reject-booking.command';
import { RejectBookingResult } from '../../application/commands/reject-booking/reject-booking.result';
import { RescheduleSessionCommand } from '../../application/commands/reschedule-session/reschedule-session.command';
import { RescheduleSessionResult } from '../../application/commands/reschedule-session/reschedule-session.result';
import {
  BookingStatusUpdateResponseDto,
  CreateDirectBookingResponseDto,
  BookingResponseDto,
} from '../schemas/booking-response.dto';
import { CreateDirectBookingDto } from '../schemas/create-direct-booking.dto';
import { GetBookingsQueryDto } from '../schemas/get-bookings-query.dto';
import {
  MarkSessionAttendanceDto,
  MarkSessionAttendanceResponseDto,
} from '../schemas/mark-session-attendance.dto';
import { MarkSessionAttendanceCommand } from '../../application/commands/mark-session-attendance/mark-session-attendance.command';
import { MarkSessionAttendanceResult } from '../../application/commands/mark-session-attendance/mark-session-attendance.result';
import {
  TakeAttendanceDto,
  TakeAttendanceResponseDto,
} from '../schemas/take-attendance.dto';
import { TakeAttendanceCommand } from '../../application/commands/take-attendance/take-attendance.command';
import { TakeAttendanceResult } from '../../application/commands/take-attendance/take-attendance.result';
import { GetBookingsQuery } from '../../application/queries/get-bookings/get-bookings.query';
import { GetBookingByIdQuery } from '../../application/queries/get-booking-by-id/get-booking-by-id.query';
import { GetMySessionsQuery } from '../../application/queries/get-my-sessions/get-my-sessions.query';
import { GetTutorSessionsQuery } from '../../application/queries/get-tutor-sessions/get-tutor-sessions.query';
import { BookingResultData } from '../../application/queries/get-bookings/get-bookings.result';
import { MySessionResultData } from '../../application/queries/get-my-sessions/get-my-sessions.result';
import { QueryResult } from '../../../../shared/domain/common/query';
import { SessionResponseDto } from '../schemas/session-response.dto';
import { GetMySessionsQueryDto } from '../schemas/get-my-sessions-query.dto';
import {
  RescheduleSessionDto,
  RescheduleSessionResponseDto,
} from '../schemas/reschedule-session.dto';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getBookings',
    summary: 'Get bookings for current user',
    description:
      'Returns a paginated list of bookings where current user is student or tutor. Defaults to CONFIRMED status.',
  })
  @ApiOkResponseQueryWrapped(BookingResponseDto, {
    description: 'List of bookings returned successfully.',
  })
  async getBookings(
    @CurrentUser() user: { userId: string; role: 'STUDENT' | 'TUTOR' },
    @Query() query: GetBookingsQueryDto,
  ): Promise<QueryApiResponse<BookingResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const result = await this.queryBus.execute<
      GetBookingsQuery,
      QueryResult<BookingResultData>
    >(
      new GetBookingsQuery({
        userId: user.userId,
        role: user.role,
        page,
        limit,
        skip,
        search: query.search,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        status: query.status,
        mode: query.mode,
      }),
    );

    const mappedData = result.data.map((item) =>
      BookingResponseDto.fromResult(item),
    );
    return QueryResponse.query({ ...result, data: mappedData });
  }

  @Get('sessions/my')
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getMySessions',
    summary: 'Get all sessions for current user',
    description:
      'Returns a paginated list of sessions where current user is student or tutor',
  })
  @ApiOkResponseQueryWrapped(SessionResponseDto, {
    description: 'List of sessions returned successfully.',
  })
  async getMySessions(
    @CurrentUser() user: { userId: string; role: 'STUDENT' | 'TUTOR' },
    @Query() query: GetMySessionsQueryDto,
  ): Promise<QueryApiResponse<SessionResponseDto>> {
    const result = await this.queryBus.execute<
      GetMySessionsQuery,
      QueryResult<MySessionResultData>
    >(new GetMySessionsQuery(user.userId, user.role, query));

    const mappedData = result.data.map((item) =>
      SessionResponseDto.fromResult(item),
    );
    return QueryResponse.query({ ...result, data: mappedData });
  }

  @Get('sessions/tutor/:tutorId')
  @Public()
  @ApiOperation({
    operationId: 'getTutorSessions',
    summary: 'Get public sessions for a specific tutor',
    description:
      'Returns a paginated list of public sessions for a tutor, with sensitive info redacted',
  })
  @ApiOkResponseQueryWrapped(SessionResponseDto, {
    description: 'List of public tutor sessions returned successfully.',
  })
  async getTutorSessions(
    @Param('tutorId') tutorId: string,
    @Query() query: GetMySessionsQueryDto,
  ): Promise<QueryApiResponse<SessionResponseDto>> {
    const result = await this.queryBus.execute<
      GetTutorSessionsQuery,
      QueryResult<MySessionResultData>
    >(new GetTutorSessionsQuery(tutorId, query));

    const mappedData = result.data.map((item) =>
      SessionResponseDto.fromResult(item),
    );
    return QueryResponse.query({ ...result, data: mappedData });
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getBookingById',
    summary: 'Get booking by ID',
    description:
      'Returns the details of a booking if the current user is associated with it',
  })
  @ApiOkResponseWrapped(BookingResponseDto, {
    description: 'Booking returned successfully.',
  })
  async getBookingById(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<BaseResponse<BookingResponseDto>> {
    const result = await this.queryBus.execute<
      GetBookingByIdQuery,
      BookingResultData
    >(new GetBookingByIdQuery(id, user.userId));

    return BaseResponse.ok(BookingResponseDto.fromResult(result));
  }

  @Post('direct')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createDirectBooking',
    summary: 'Student creates a direct booking with a specific tutor',
  })
  @ApiCreatedResponseWrapped(CreateDirectBookingResponseDto, {
    description: 'Booking created successfully with status PENDING.',
  })
  async createDirectBooking(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateDirectBookingDto,
  ): Promise<BaseResponse<CreateDirectBookingResponseDto>> {
    const result = await this.commandBus.execute<
      CreateDirectBookingCommand,
      CreateDirectBookingResult
    >(
      new CreateDirectBookingCommand(
        user.userId,
        dto.tutorId,
        dto.subjectId ?? null,
        dto.mode,
        dto.message ?? null,
        dto.totalSessions,
        dto.scheduleRules,
      ),
    );

    return BaseResponse.created(
      CreateDirectBookingResponseDto.fromResult(result),
    );
  }

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

  @Post('sessions/:sessionId/reschedule')
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'rescheduleSession',
    summary: 'Student or tutor requests a session reschedule',
    description:
      'Creates a reschedule request for the session and moves it to RESCHEDULE_REQUESTED.',
  })
  @ApiOkResponseWrapped(RescheduleSessionResponseDto, {
    description: 'Session reschedule request recorded successfully.',
  })
  async rescheduleSession(
    @CurrentUser() user: { userId: string },
    @Param('sessionId') sessionId: string,
    @Body() dto: RescheduleSessionDto,
  ): Promise<BaseResponse<RescheduleSessionResponseDto>> {
    const result = await this.commandBus.execute<
      RescheduleSessionCommand,
      RescheduleSessionResult
    >(
      new RescheduleSessionCommand(
        sessionId,
        user.userId,
        dto.proposedStartTime,
        dto.proposedEndTime,
        dto.reason,
      ),
    );

    return BaseResponse.ok(RescheduleSessionResponseDto.fromResult(result));
  }

  @Patch('sessions/:sessionId/attendance')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'markSessionAttendance',
    summary: 'Tutor marks a session as complete with attendance status',
  })
  @ApiOkResponseWrapped(MarkSessionAttendanceResponseDto, {
    description: 'Session attendance marked successfully.',
  })
  async markSessionAttendance(
    @CurrentUser() user: { userId: string },
    @Param('sessionId') sessionId: string,
    @Body() dto: MarkSessionAttendanceDto,
  ): Promise<BaseResponse<MarkSessionAttendanceResponseDto>> {
    const result = await this.commandBus.execute<
      MarkSessionAttendanceCommand,
      MarkSessionAttendanceResult
    >(
      new MarkSessionAttendanceCommand(
        sessionId,
        user.userId,
        dto.studentId,
        dto.status,
        dto.notes ?? null,
      ),
    );

    return BaseResponse.ok(MarkSessionAttendanceResponseDto.fromResult(result));
  }

  @Post('sessions/:sessionId/attendance')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'takeAttendance',
    summary: 'Tutor takes attendance for a session',
    description:
      'Tutor takes attendance for the lesson. Create/update the SessionAttendance record and change the Session status to AWAITING_CONFIRMATION.',
  })
  @ApiCreatedResponseWrapped(TakeAttendanceResponseDto, {
    description:
      'Attendance recorded successfully. Session status set to AWAITING_CONFIRMATION.',
  })
  async takeAttendance(
    @CurrentUser() user: { userId: string },
    @Param('sessionId') sessionId: string,
    @Body() dto: TakeAttendanceDto,
  ): Promise<BaseResponse<TakeAttendanceResponseDto>> {
    const result = await this.commandBus.execute<
      TakeAttendanceCommand,
      TakeAttendanceResult
    >(
      new TakeAttendanceCommand(
        sessionId,
        user.userId,
        dto.status,
        dto.notes ?? null,
      ),
    );

    return BaseResponse.created(TakeAttendanceResponseDto.fromResult(result));
  }
}
