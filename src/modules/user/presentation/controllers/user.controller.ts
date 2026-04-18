import { Body, Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiImageUpload } from 'src/shared/presentation/decorators/api-image-upload.decorator';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/application/common/query';
import {
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { Query as QueryParamsDecorator } from '../../../../shared/presentation/decorators/query.decorator';
import { UploadedImage } from '../../../../shared/presentation/decorators/uploaded-image.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { UploadedImageDto } from '../../../../shared/presentation/schemas/upload-image.dto';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { ChangeAvatarCommand } from '../../application/commands/change-avatar/change-avatar.command';
import { ChangeAvatarResult } from '../../application/commands/change-avatar/change-avatar.result';
import { UpdateProfileCommand } from '../../application/commands/update-profile/update-profile.command';
import { UpdateProfileResult } from '../../application/commands/update-profile/update-profile.result';
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query';
import {
  GetUsersResult,
  GetUsersResultData,
} from '../../application/queries/get-users/get-users.result';
import { ChangeAvatarResultDto } from '../schemas/change-avatar-response.dto';
import { UpdateProfileResultDto } from '../schemas/profile-response.dto';
import { UpdateProfileDto } from '../schemas/update-profile.dto';
import { UserResponseDto } from '../schemas/user-response.dto';
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
  @UseInterceptors(FileInterceptor('avatar'))
  async changeAvatar(
    @CurrentUser() user: { userId: string },
    @UploadedImage() file: UploadedImageDto,
  ): Promise<BaseResponse<ChangeAvatarResult>> {
    const result = await this.commandBus.execute<
      ChangeAvatarCommand,
      ChangeAvatarResult
    >(new ChangeAvatarCommand(user.userId, file.buffer, file.mimetype));

    return BaseResponse.ok(result);
  }
}
