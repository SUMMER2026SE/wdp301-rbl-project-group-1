import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { ChangeCourseStatusCommand } from '../../application/commands/change-course-status/change-course-status.command';
import { ChangeCourseStatusResult } from '../../application/commands/change-course-status/change-course-status.result';
import { CreateCourseCommand } from '../../application/commands/create-course/create-course.command';
import { CreateCourseResult } from '../../application/commands/create-course/create-course.result';
import { UpdateCourseCommand } from '../../application/commands/update-course/update-course.command';
import { UpdateCourseResult } from '../../application/commands/update-course/update-course.result';
import { GetCourseByIdQuery } from '../../application/queries/get-course-by-id/get-course-by-id.query';
import { GetCourseByIdResult } from '../../application/queries/get-course-by-id/get-course-by-id.result';
import { GetCoursesQuery } from '../../application/queries/get-courses/get-courses.query';
import {
  CourseResultData,
  GetCoursesResult,
} from '../../application/queries/get-courses/get-courses.result';
import { GetJoinedStudentsQuery } from '../../application/queries/get-joined-students/get-joined-students.query';
import { GetJoinedStudentsResult } from '../../application/queries/get-joined-students/get-joined-students.result';
import { GetTutorCoursesQuery } from '../../application/queries/get-tutor-courses/get-tutor-courses.query';
import {
  GetTutorCoursesResult,
  TutorCourseResultData,
} from '../../application/queries/get-tutor-courses/get-tutor-courses.result';
import { CoursePaginatedParams } from '../../domain/repositories/course.repository.interface';
import { ChangeCourseStatusDto } from '../schemas/change-course-status.dto';
import {
  CourseResponseDto,
  CreateCourseResultDto,
  GetJoinedStudentsResultDto,
  UpdateCourseResultDto,
} from '../schemas/course-response.dto';
import { CreateCourseDto } from '../schemas/create-course.dto';
import {
  GetCoursesQueryDto,
  GetCoursesQueryParams,
} from '../schemas/get-courses-query.dto';
import { UpdateCourseDto } from '../schemas/update-course.dto';

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
  @ApiOperation({
    operationId: 'getAllCourses',
    summary: 'Get all courses',
    description:
      'Returns a paginated list of courses. Supports search by title and filters by gradeId, subjectId.',
  })
  @ApiOkResponseQueryWrapped(CourseResponseDto, {
    description: 'List of courses returned successfully.',
  })
  async getCourses(
    @Query() dto: GetCoursesQueryDto,
  ): Promise<GetCoursesResult> {
    const query: GetCoursesQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params: CoursePaginatedParams = {
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      gradeId: query.gradeId,
      subjectId: query.subjectId,
    };

    const result = await this.queryBus.execute<
      GetCoursesQuery,
      QueryResult<CourseResultData>
    >(new GetCoursesQuery(params));

    return QueryResponse.query(result);
  }

  @Get('tutor/me')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getTutorMeCourses',
    summary: 'Get courses of the current user (tutor)',
    description:
      'Returns a paginated list of courses for the currently authenticated tutor.',
  })
  @ApiOkResponseQueryWrapped(CourseResponseDto, {
    description: 'List of tutor courses returned successfully.',
  })
  async getTutorCourses(
    @CurrentUser() user: { userId: string },
    @Query() dto: GetCoursesQueryDto,
  ): Promise<GetTutorCoursesResult> {
    const query: GetCoursesQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params: CoursePaginatedParams = {
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      gradeId: query.gradeId,
      subjectId: query.subjectId,
      status: query.status,
    };

    const result = await this.queryBus.execute<
      GetTutorCoursesQuery,
      QueryResult<TutorCourseResultData>
    >(new GetTutorCoursesQuery(user.userId, params));

    return QueryResponse.query(result);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    operationId: 'getCourseById',
    summary: 'Get a course by ID',
  })
  @ApiOkResponseWrapped(CourseResponseDto, {
    description: 'Course returned successfully.',
  })
  async getCourseById(@Param('id') id: string) {
    const result = await this.queryBus.execute<
      GetCourseByIdQuery,
      GetCourseByIdResult
    >(new GetCourseByIdQuery(id));
    return BaseResponse.ok(result);
  }

  @Get(':id/students')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getJoinedStudents',
    summary: 'Get students joined in a course',
  })
  @ApiOkResponseWrapped(GetJoinedStudentsResultDto, {
    description: 'Joined students returned successfully.',
  })
  async getJoinedStudents(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<BaseResponse<GetJoinedStudentsResult>> {
    const result = await this.queryBus.execute<
      GetJoinedStudentsQuery,
      GetJoinedStudentsResult
    >(new GetJoinedStudentsQuery(user.userId, id));

    return BaseResponse.ok(result);
  }

  @Put(':id')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'updateCourse',
    summary: 'Update a course',
  })
  @ApiOkResponseWrapped(UpdateCourseResultDto, {
    description: 'Course updated successfully.',
  })
  async updateCourse(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ): Promise<BaseResponse<UpdateCourseResult>> {
    const result = await this.commandBus.execute<
      UpdateCourseCommand,
      UpdateCourseResult
    >(
      new UpdateCourseCommand(
        user.userId,
        id,
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

  @Patch(':courseId')
  @Roles(UserRole.TUTOR)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'changeCourseStatus',
    summary: 'Change course status',
  })
  @ApiCreatedResponseWrapped(CreateCourseResultDto, {
    description: 'Course successfully updated.',
  })
  async changeCourseStatus(
    @CurrentUser() user: { userId: string; email: string },
    @Param('courseId') courseId: string,
    @Body() dto: ChangeCourseStatusDto,
  ): Promise<BaseResponse<ChangeCourseStatusResult>> {
    const result = await this.commandBus.execute<
      ChangeCourseStatusCommand,
      ChangeCourseStatusResult
    >(
      new ChangeCourseStatusCommand(
        user.userId,
        user.email,
        courseId,
        dto.status,
      ),
    );
    return BaseResponse.ok(result);
  }
}
