import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import type { MultipartFile } from '@fastify/multipart';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { ApiImageUpload } from '../../../../modules/storage/presentation/decorators/api-image-upload.decorator';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { Query as QueryParamsDecorator } from '../../../../shared/presentation/decorators/query.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { ChangeAvatarCommand } from '../../application/commands/change-avatar/change-avatar.command';
import { ChangeAvatarResult } from '../../application/commands/change-avatar/change-avatar.result';
import { UpdateProfileCommand } from '../../application/commands/update-profile/update-profile.command';
import { UpdateProfileResult } from '../../application/commands/update-profile/update-profile.result';
import { UpdateStudentProfileCommand } from '../../application/commands/update-student-profile/update-student-profile.command';
import { UpdateStudentProfileResult } from '../../application/commands/update-student-profile/update-student-profile.result';
import { UpdateTutorProfileCommand } from '../../application/commands/update-tutor-profile/update-tutor-profile.command';
import { UpdateTutorProfileResult } from '../../application/commands/update-tutor-profile/update-tutor-profile.result';
import { UpgradeTutorCommand } from '../../application/commands/upgrade-tutor/upgrade-tutor.command';
import { UpgradeTutorResult } from '../../application/commands/upgrade-tutor/upgrade-tutor.result';
import { GetProfileQuery } from '../../application/queries/get-profile/get-profile.query';
import { GetProfileResult } from '../../application/queries/get-profile/get-profile.result';
import { GetUserProfileByIdQuery } from '../../application/queries/get-user-profile-by-id/get-user-profile-by-id.query';
import { GetUserProfileByIdResult } from '../../application/queries/get-user-profile-by-id/get-user-profile-by-id.result';
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query';
import {
  GetUsersResult,
  GetUsersResultData,
} from '../../application/queries/get-users/get-users.result';
import { ChangeAvatarResultDto } from '../schemas/change-avatar-response.dto';
import { GetProfileResponseDto } from '../schemas/get-profile-response.dto';
import { GetUserProfileByIdResponseDto } from '../schemas/get-user-profile-by-id-response.dto';
import { UpdateProfileResultDto } from '../schemas/profile-response.dto';
import { UpdateProfileDto } from '../schemas/update-profile.dto';
import { UpdateStudentProfileDto } from '../schemas/update-student-profile.dto';
import { UpdateTutorProfileDto } from '../schemas/update-tutor-profile.dto';
import { UpgradeTutorResultDto } from '../schemas/upgrade-tutor-response.dto';
import { UserResponseDto } from '../schemas/user-response.dto';

const ALLOWED_AVATAR_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

const ALLOWED_AVATAR_FIELD_NAMES = new Set(['avatar', 'file']);

const streamToBuffer = async (stream: NodeJS.ReadableStream) => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'getUsers', summary: 'Get all users' })
  @ApiOkResponseQueryWrapped(UserResponseDto, {
    description: 'List of users returned successfully.',
  })
  async getUsers(
    @QueryParamsDecorator() query: QueryParams,
  ): Promise<GetUsersResult> {
    const result = await this.queryBus.execute<
      GetUsersQuery,
      QueryResult<GetUsersResultData>
    >(new GetUsersQuery(query));

    return QueryResponse.query(result);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getProfile',
    summary: 'Get current authenticated user profile',
  })
  @ApiOkResponseWrapped(GetProfileResponseDto, {
    description: 'Current user information returned successfully.',
  })
  async getProfile(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<GetProfileResult>> {
    const result = await this.queryBus.execute<
      GetProfileQuery,
      GetProfileResult
    >(new GetProfileQuery(user.userId));

    return BaseResponse.ok(result);
  }

  @Get(':id')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getUserProfileById',
    summary: 'Get public user profile by ID',
  })
  @ApiOkResponseWrapped(GetUserProfileByIdResponseDto, {
    description: 'User profile returned successfully.',
  })
  async getUserProfileById(
    @Param('id') id: string,
    @CurrentUser() viewer?: { userId: string },
  ): Promise<BaseResponse<GetUserProfileByIdResult>> {
    const result = await this.queryBus.execute<
      GetUserProfileByIdQuery,
      GetUserProfileByIdResult
    >(new GetUserProfileByIdQuery(id, viewer?.userId));

    return BaseResponse.ok(result);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'updateProfile',
    summary: 'Update current user profile',
  })
  @ApiOkResponseWrapped(UpdateProfileResultDto, {
    description: 'Profile updated successfully.',
  })
  async updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfileDto,
  ): Promise<BaseResponse<UpdateProfileResult>> {
    const result = await this.commandBus.execute<
      UpdateProfileCommand,
      UpdateProfileResult
    >(
      new UpdateProfileCommand(user.userId, {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      }),
    );

    return BaseResponse.ok(result);
  }

  @Patch('avatar')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'changeAvatar',
    summary: 'Change current user avatar',
  })
  @ApiImageUpload('avatar')
  @ApiOkResponseWrapped(ChangeAvatarResultDto, {
    description: 'Avatar updated successfully.',
  })
  async changeAvatar(
    @CurrentUser() user: { userId: string },
    @Req() req: FastifyRequest,
  ): Promise<BaseResponse<ChangeAvatarResult>> {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const data: MultipartFile | undefined = await req.file();

    if (!data) {
      throw new BadRequestException('File is missing');
    }

    if (!ALLOWED_AVATAR_FIELD_NAMES.has(data.fieldname)) {
      throw new BadRequestException('Invalid file field name');
    }

    if (!ALLOWED_AVATAR_MIME_TYPES.has(data.mimetype)) {
      throw new BadRequestException('Invalid image type');
    }

    const buffer = await streamToBuffer(data.file);

    const result = await this.commandBus.execute<
      ChangeAvatarCommand,
      ChangeAvatarResult
    >(new ChangeAvatarCommand(user.userId, buffer, data.mimetype));

    return BaseResponse.ok(result);
  }

  @Patch('me/upgrade-tutor')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'upgradeTutor',
    summary: 'Upgrade current user to tutor role',
  })
  @ApiOkResponseWrapped(UpgradeTutorResultDto, {
    description: 'User successfully upgraded to tutor.',
  })
  async upgradeTutor(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<UpgradeTutorResult>> {
    const result = await this.commandBus.execute<
      UpgradeTutorCommand,
      UpgradeTutorResult
    >(new UpgradeTutorCommand(user.userId));

    return BaseResponse.ok(result);
  }

  @Patch('tutor-profile')
  @ApiBearerAuth()
  @Roles(UserRole.TUTOR)
  @ApiOperation({
    operationId: 'updateTutorProfile',
    summary:
      'Update tutor profile (bio, specialization, education, experience, price)',
  })
  @ApiOkResponseWrapped(UpdateProfileResultDto, {
    description: 'Tutor profile updated successfully.',
  })
  async updateTutorProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateTutorProfileDto,
  ): Promise<BaseResponse<UpdateTutorProfileResult>> {
    const result = await this.commandBus.execute<
      UpdateTutorProfileCommand,
      UpdateTutorProfileResult
    >(new UpdateTutorProfileCommand(user.userId, dto));

    return BaseResponse.ok(result);
  }

  @Patch('student-profile')
  @ApiBearerAuth()
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    operationId: 'updateStudentProfile',
    summary:
      'Update student profile (school, learningGoal, gradeIds, subjectIds)',
  })
  @ApiOkResponseWrapped(UpdateProfileResultDto, {
    description: 'Student profile updated successfully.',
  })
  async updateStudentProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateStudentProfileDto,
  ): Promise<BaseResponse<UpdateStudentProfileResult>> {
    const result = await this.commandBus.execute<
      UpdateStudentProfileCommand,
      UpdateStudentProfileResult
    >(new UpdateStudentProfileCommand(user.userId, dto));

    return BaseResponse.ok(result);
  }
}
