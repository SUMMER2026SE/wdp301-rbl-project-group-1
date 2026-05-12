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
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateTutorApplicationCommand } from '../../application/command/create-tutor-application/create-tutor-application.command';
import { CreateTutorApplicationResult } from '../../application/command/create-tutor-application/create-tutor-application.result';
import { GetTutorApplicationQuery } from '../../application/query/get-tutor-application/get-tutor-application.query';
import { GetTutorApplicationResult } from '../../application/query/get-tutor-application/get-tutor-application.result';
import { TutorApplicationStatus } from '../../domain/enums/tutor-application';
import { FindTutorApplicationsParams } from '../../domain/repositories/tutor-application.repository';
import { CreateTutorApplicationDto } from '../schemas/create-tutor-application.dto';
import {
  GetTutorApplicationsDto,
  GetTutorApplicationsQueryParams,
} from '../schemas/get-tutor-applications.dto';
import {
  CreateTutorApplicationResponseDto,
  TutorApplicationResponseDto,
  ApproveTutorApplicationResponseDto,
  RejectTutorApplicationResponseDto,
} from '../schemas/tutor-application-response.dto';
import { ApproveTutorApplicationCommand } from '../../application/command/approve-tutor-application/approve-tutor-application.command';
import { ApproveTutorApplicationResult } from '../../application/command/approve-tutor-application/approve-tutor-application.result';
import { RejectTutorApplicationCommand } from '../../application/command/reject-tutor-application/reject-tutor-application.command';
import { RejectTutorApplicationResult } from '../../application/command/reject-tutor-application/reject-tutor-application.result';

@ApiTags('Tutor Application')
@Controller('tutor-applications')
export class TutorApplicationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post()
  @ApiOperation({
    operationId: 'createTutorApplication',
    summary: 'Create a new tutor application via email',
  })
  @ApiCreatedResponseWrapped(CreateTutorApplicationResponseDto, {
    description: 'Tutor application created successfully.',
  })
  async createTutorApplication(
    @Body() dto: CreateTutorApplicationDto,
  ): Promise<BaseResponse<CreateTutorApplicationResponseDto>> {
    const result = await this.commandBus.execute<
      CreateTutorApplicationCommand,
      CreateTutorApplicationResult
    >(
      new CreateTutorApplicationCommand(
        dto.email,
        dto.specialization,
        dto.subjectIds,
        dto.gradeIds,
        dto.bio,
        dto.experience,
        dto.education,
        dto.pricePerHour,
        dto.avatarUrl,
        dto.files,
      ),
    );

    return BaseResponse.created(
      CreateTutorApplicationResponseDto.fromResult(result),
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getTutorApplications',
    summary: 'Get list of tutor applications',
  })
  @ApiOkResponseQueryWrapped(TutorApplicationResponseDto, {
    description: 'List of tutor applications returned successfully.',
  })
  async getTutorApplications(@Query() queryDto: GetTutorApplicationsDto) {
    const query: GetTutorApplicationsQueryParams = queryDto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const queryParams: FindTutorApplicationsParams = {
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: query.status as TutorApplicationStatus,
    };

    const result = await this.queryBus.execute<
      GetTutorApplicationQuery,
      GetTutorApplicationResult
    >(new GetTutorApplicationQuery(queryParams));

    return QueryResponse.query({
      ...result.result,
      data: result.result.data.map((app) =>
        TutorApplicationResponseDto.fromEntity(app),
      ),
    });
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'approveTutorApplication',
    summary: 'Approve a tutor application and create tutor account',
  })
  @ApiOkResponseWrapped(ApproveTutorApplicationResponseDto, {
    description: 'Tutor application approved successfully.',
  })
  async approveTutorApplication(
    @Param('id') id: string,
  ): Promise<BaseResponse<ApproveTutorApplicationResponseDto>> {
    const result = await this.commandBus.execute<
      ApproveTutorApplicationCommand,
      ApproveTutorApplicationResult
    >(new ApproveTutorApplicationCommand(id));

    return BaseResponse.ok(
      ApproveTutorApplicationResponseDto.fromResult(result),
    );
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'rejectTutorApplication',
    summary: 'Reject a tutor application',
  })
  @ApiOkResponseWrapped(RejectTutorApplicationResponseDto, {
    description: 'Tutor application rejected successfully.',
  })
  async rejectTutorApplication(
    @Param('id') id: string,
  ): Promise<BaseResponse<RejectTutorApplicationResponseDto>> {
    const result = await this.commandBus.execute<
      RejectTutorApplicationCommand,
      RejectTutorApplicationResult
    >(new RejectTutorApplicationCommand(id));

    return BaseResponse.ok(
      RejectTutorApplicationResponseDto.fromResult(result),
    );
  }
}
