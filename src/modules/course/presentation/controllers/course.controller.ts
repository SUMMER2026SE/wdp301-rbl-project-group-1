import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateCourseCommand } from '../../application/commands/create-course/create-course.command';
import { CreateCourseResult } from '../../application/commands/create-course/create-course.result';
import { GetCoursesQuery } from '../../application/queries/get-courses/get-courses.query';
import { GetCoursesResult } from '../../application/queries/get-courses/get-courses.result';
import {
  CourseDto,
  CreateCourseResultDto,
} from '../schemas/course-response.dto';
import { CreateCourseDto } from '../schemas/create-course.dto';

@ApiTags('Course')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'createCourse', summary: 'Create a new course' })
  @ApiCreatedResponseWrapped(CreateCourseResultDto, {
    description: 'Course successfully created.',
  })
  async createCourse(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateCourseDto,
  ): Promise<BaseResponse<CreateCourseResult>> {
    const result = await this.commandBus.execute<
      CreateCourseCommand,
      CreateCourseResult
    >(
      new CreateCourseCommand(
        user.userId,
        dto.title,
        dto.description,
        dto.price,
        dto.subjectId,
        dto.gradeId,
        dto.level,
      ),
    );
    return BaseResponse.ok(result);
  }

  @Get()
  @Public()
  @ApiOperation({ operationId: 'getAllCourses', summary: 'Get all courses' })
  @ApiOkResponseWrapped(CourseDto, {
    description: 'Returns all courses',
    isArray: true,
  })
  async getCourses() {
    const query = new GetCoursesQuery();
    const result = await this.queryBus.execute<
      GetCoursesQuery,
      GetCoursesResult
    >(query);
    return BaseResponse.ok(result.courses);
  }
}
