import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { ApiOkResponseQueryWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { Query as QueryParamsDecorator } from '../../../../shared/presentation/decorators/query.decorator';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { GetTutorsQuery } from '../../application/queries/get-tutors/get-tutors.query';
import {
  GetTutorsResult,
  GetTutorsResultData,
} from '../../application/queries/get-tutors/get-tutors.result';
import { TutorResponseDto } from '../schemas/tutor-response.dto';

@ApiTags('Tutors')
@Controller('tutors')
export class TutorController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({ operationId: 'getTutors', summary: 'Get tutors' })
  @ApiOkResponseQueryWrapped(TutorResponseDto, {
    description: 'List of tutors returned successfully.',
  })
  async getTutors(
    @QueryParamsDecorator() query: QueryParams,
  ): Promise<GetTutorsResult> {
    const result = await this.queryBus.execute<
      GetTutorsQuery,
      QueryResult<GetTutorsResultData>
    >(new GetTutorsQuery(query));

    return QueryResponse.query(result);
  }
}
