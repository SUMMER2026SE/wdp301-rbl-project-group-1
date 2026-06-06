import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { AcceptTutorBidCommand } from '../../application/commands/accept-tutor-bid/accept-tutor-bid.command';
import { AcceptTutorBidResult } from '../../application/commands/accept-tutor-bid/accept-tutor-bid.result';
import { CreateTutorRequestCommand } from '../../application/commands/create-tutor-request/create-tutor-request.command';
import { CreateTutorRequestResult } from '../../application/commands/create-tutor-request/create-tutor-request.result';
import { SetTutorBidCommand } from '../../application/commands/set-tutor-bid/set-tutor-bid.command';
import { SetTutorBidResult } from '../../application/commands/set-tutor-bid/set-tutor-bid.result';
import { GetTutorRequestQuery } from '../../application/queries/get-tutor-request/get-tutor-request.query';
import { GetTutorRequestResult } from '../../application/queries/get-tutor-request/get-tutor-request.result';
import { GetTutorRequestsQuery } from '../../application/queries/get-tutor-requests/get-tutor-requests.query';
import {
  GetTutorRequestsResult,
  TutorRequestResultData,
} from '../../application/queries/get-tutor-requests/get-tutor-requests.result';
import {
  GetTutorRequestsQueryDto,
  GetTutorRequestsQueryParams,
} from '../schemas/get-tutor-requests-query.dto';
import {
  AcceptTutorBidResponseDto,
  TutorBidResponseDto,
  TutorRequestResponseDto,
} from '../schemas/tutor-request-response.dto';
import {
  CreateTutorRequestDto,
  SetTutorBidDto,
} from '../schemas/tutor-request.dto';

@ApiTags('Tutor Request')
@Controller('tutor-requests')
export class TutorRequestController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
        dto.gradeId,
        dto.budget,
        dto.totalSessions,
        dto.scheduleRules,
      ),
    );

    return BaseResponse.created(TutorRequestResponseDto.fromResult(result));
  }

  @Get()
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getTutorRequests',
    summary: 'Get tutor requests',
    description:
      'Returns a paginated list of tutor requests with filter capabilities (mode, subject, status).',
  })
  @ApiOkResponseQueryWrapped(TutorRequestResponseDto, {
    description: 'List of tutor requests returned successfully.',
  })
  async getTutorRequests(
    @Query() dto: GetTutorRequestsQueryDto,
  ): Promise<GetTutorRequestsResult> {
    const query: GetTutorRequestsQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params = {
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      subjectIds: query.subjectIds,
      gradeIds: query.gradeIds,
      studentId: query.studentId,
      mode: query.mode,
      status: query.status,
    };

    const result = await this.queryBus.execute<
      GetTutorRequestsQuery,
      QueryResult<TutorRequestResultData>
    >(new GetTutorRequestsQuery(params));

    return QueryResponse.query(result);
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getTutorRequest',
    summary: 'Get a tutor request by ID',
  })
  @ApiOkResponseWrapped(TutorRequestResponseDto, {
    description: 'Tutor request returned successfully.',
  })
  async getTutorRequest(
    @Param('id') id: string,
  ): Promise<BaseResponse<TutorRequestResponseDto>> {
    const result = await this.queryBus.execute<
      GetTutorRequestQuery,
      GetTutorRequestResult
    >(new GetTutorRequestQuery(id));

    return BaseResponse.ok(TutorRequestResponseDto.fromResult(result));
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
