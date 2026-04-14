import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/application/common/query';
import { ApiOkResponseQueryWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { Query as QueryParamsDecorator } from '../../../../shared/presentation/decorators/query.decorator';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { GetUsersQuery } from '../../application/queries/get-users/get-users.query';
import {
  GetUsersResult,
  GetUsersResultData,
} from '../../application/queries/get-users/get-users.result';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

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
}
