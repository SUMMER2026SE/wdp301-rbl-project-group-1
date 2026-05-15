import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateLessonCommand } from '../../application/commands/create-lesson/create-lesson.command';
import { CreateLessonResult } from '../../application/commands/create-lesson/create-lesson.result';
import { GetLessonByIdQuery } from '../../application/queries/get-lesson-by-id/get-lesson-by-id.query';
import { GetLessonByIdResult } from '../../application/queries/get-lesson-by-id/get-lesson-by-id.result';
import { CreateLessonDto } from '../schemas/create-lesson.dto';
import {
  CreateLessonResultDto,
  LessonResponseDto,
} from '../schemas/lesson-response.dto';

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

  @Get(':id')
  // @Roles(UserRole.TUTOR)
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
