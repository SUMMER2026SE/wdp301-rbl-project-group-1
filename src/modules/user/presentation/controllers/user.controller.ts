import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
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
  @ApiOkResponse({
    description: 'List of users returned successfully.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Success' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              email: { type: 'string', example: 'user@example.com' },
              role: { type: 'string', example: 'STUDENT' },
              nickname: { type: 'string', nullable: true, example: 'JohnDoe' },
              isActive: { type: 'boolean', example: true },
              isVerified: { type: 'boolean', example: false },
              isFlag: { type: 'boolean', example: false },
              reportCount: { type: 'number', example: 0 },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-01-01T00:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  async getUsers(): Promise<unknown> {
    const users = await this.queryBus.execute<GetUsersQuery, User[]>(
      new GetUsersQuery(),
    );
    return BaseResponse.ok(users.map((u) => UserResponseDto.fromDomain(u)));
  }
}
