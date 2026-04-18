import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/application/common/query';
import {
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { Query as QueryParamsDecorator } from '../../../../shared/presentation/decorators/query.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { UpdateProfileCommand } from '../../application/commands/update-profile/update-profile.command';
import { UpdateProfileResult } from '../../application/commands/update-profile/update-profile.result';
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query';
import {
  GetUsersResult,
  GetUsersResultData,
} from '../../application/queries/get-users/get-users.result';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserResponseDto } from '../dto/user-response.dto';

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
  @ApiOkResponseWrapped(ProfileResponseDto, {
    description: 'Profile updated successfully.',
  })
  async updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfileDto,
  ): Promise<BaseResponse<UpdateProfileResult>> {
    const result = await this.commandBus.execute<
      UpdateProfileCommand,
      UpdateProfileResult
    >(new UpdateProfileCommand(Number(user.userId), dto));

    return BaseResponse.ok(result);
  }
}
