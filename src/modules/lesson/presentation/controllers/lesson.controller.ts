import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
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
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateLessonCommand } from '../../application/commands/create-lesson/create-lesson.command';
import { CreateLessonResult } from '../../application/commands/create-lesson/create-lesson.result';
import { UpdateLessonCommand } from '../../application/commands/update-lesson/update-lesson.command';
import { UpdateLessonResult } from '../../application/commands/update-lesson/update-lesson.result';
import { GetLessonByIdQuery } from '../../application/queries/get-lesson-by-id/get-lesson-by-id.query';
import { GetLessonByIdResult } from '../../application/queries/get-lesson-by-id/get-lesson-by-id.result';
import { GetLessonDetailsQuery } from '../../application/queries/get-lesson-details/get-lesson-details.query';
import { GetLessonDetailsResult } from '../../application/queries/get-lesson-details/get-lesson-details.result';
import { GetLessonsByCourseQuery } from '../../application/queries/get-lessons-by-course/get-lessons-by-course.query';
import { LessonByCourseResultData } from '../../application/queries/get-lessons-by-course/get-lessons-by-course.result';
import { LessonPaginatedParams } from '../../domain/repositories/lesson.repository.interface';
import { CreateLessonDto } from '../schemas/create-lesson.dto';
import {
  GetLessonsByCourseQueryDto,
  GetLessonsByCourseQueryParams,
} from '../schemas/get-lessons-by-course-query.dto';
import {
  CreateLessonResultDto,
  LessonDetailsResponseDto,
  LessonResponseDto,
  UpdateLessonResultDto,
} from '../schemas/lesson-response.dto';
import { UpdateLessonDto } from '../schemas/update-lesson.dto';

@ApiTags('Lesson')
@Controller('lessons')
export class LessonController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'createLesson', summary: 'Create a new lesson' })
  @ApiCreatedResponseWrapped(CreateLessonResultDto, {
    description: 'Lesson successfully created.',
  })
  async createLesson(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateLessonDto,
  ): Promise<BaseResponse<CreateLessonResult>> {
    const cmd = new CreateLessonCommand(
      user.userId,
      dto.courseId,
      dto.title,
      new Date(dto.startTime),
      new Date(dto.endTime),
      dto.orderIndex,
      dto.status,
      dto.content,
      dto.meetingUrl,
      dto.videoUrl,
    );

    const result = await this.commandBus.execute<
      CreateLessonCommand,
      CreateLessonResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getLessonsByCourse',
    summary: 'Get paginated lessons by course ID',
  })
  @ApiOkResponseQueryWrapped(LessonResponseDto, {
    description: 'Paginated list of lessons for the course.',
  })
  async getLessonsByCourse(
    @Param('courseId') courseId: string,
    @Query() dto: GetLessonsByCourseQueryDto,
  ) {
    const query: GetLessonsByCourseQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params: LessonPaginatedParams = {
      courseId,
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await this.queryBus.execute<
      GetLessonsByCourseQuery,
      QueryResult<LessonByCourseResultData>
    >(new GetLessonsByCourseQuery(params));

    return QueryResponse.query(result);
  }

  @Get(':id/details')
  @Public()
  @ApiOperation({
    operationId: 'getLessonDetails',
    summary: 'Get lesson details with course and tutor info',
  })
  @ApiOkResponseWrapped(LessonDetailsResponseDto, {
    description: 'Lesson details returned successfully.',
  })
  async getLessonDetails(@Param('id') id: string) {
    const result = await this.queryBus.execute<
      GetLessonDetailsQuery,
      GetLessonDetailsResult
    >(new GetLessonDetailsQuery(id));
    return BaseResponse.ok(result);
  }

  @Patch(':id')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'updateLesson',
    summary: 'Partially update a lesson',
  })
  @ApiOkResponseWrapped(UpdateLessonResultDto, {
    description: 'Lesson updated successfully.',
  })
  async updateLesson(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ) {
    const cmd = new UpdateLessonCommand(
      id,
      dto.title,
      dto.content,
      dto.meetingUrl,
      dto.videoUrl,
      dto.startTime ? new Date(dto.startTime) : undefined,
      dto.endTime !== undefined
        ? dto.endTime
          ? new Date(dto.endTime)
          : null
        : undefined,
      dto.orderIndex,
      dto.status,
    );

    const result = await this.commandBus.execute<
      UpdateLessonCommand,
      UpdateLessonResult
    >(cmd);
    return BaseResponse.ok(result);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'getLessonById', summary: 'Get a lesson by ID' })
  @ApiOkResponseWrapped(LessonResponseDto, {
    description: 'Returns the lesson.',
  })
  async getLessonById(@Param('id') id: string) {
    const result = await this.queryBus.execute<
      GetLessonByIdQuery,
      GetLessonByIdResult
    >(new GetLessonByIdQuery(id));
    return BaseResponse.ok(result.lesson);
  }
}
