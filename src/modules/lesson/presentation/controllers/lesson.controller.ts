import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateLessonCommand } from '../../application/commands/create-lesson/create-lesson.command';
import { CreateLessonResult } from '../../application/commands/create-lesson/create-lesson.result';
import { CreateLessonDto } from '../schemas/create-lesson.dto';
import { CreateLessonResultDto } from '../schemas/lesson-response.dto';

@ApiTags('Lesson')
@Controller('lessons')
export class LessonController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
