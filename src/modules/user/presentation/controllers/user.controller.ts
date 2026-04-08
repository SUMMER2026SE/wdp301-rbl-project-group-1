import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BaseResponse } from '../../../../shared/application/common/base-response';
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
  })
  async getUsers(): Promise<BaseResponse<UserResponseDto[]>> {
    const users = await this.queryBus.execute<GetUsersQuery, User[]>(
      new GetUsersQuery(),
    );
    return BaseResponse.ok(users.map((u) => UserResponseDto.fromDomain(u)));
  }
}
