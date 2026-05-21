import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { EnrollCourseCommand } from '../../application/commands/enroll-course/enroll-course.command';
import { EnrollCourseResult } from '../../application/commands/enroll-course/enroll-course.result';
import { EnrollCourseDto } from '../schemas/enroll-course.dto';
import { EnrollCourseResultDto } from '../schemas/enrollment-response.dto';

@ApiTags('Enrollment')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'enrollCourse',
    summary: 'Enroll a student into a course',
  })
  @ApiCreatedResponseWrapped(EnrollCourseResultDto, {
    description: 'Student successfully enrolled.',
  })
  async enrollCourse(
    @CurrentUser() user: { userId: string },
    @Body() dto: EnrollCourseDto,
  ): Promise<BaseResponse<EnrollCourseResult>> {
    const result = await this.commandBus.execute<
      EnrollCourseCommand,
      EnrollCourseResult
    >(new EnrollCourseCommand(user.userId, dto.courseId));

    return BaseResponse.ok(result);
  }
}
