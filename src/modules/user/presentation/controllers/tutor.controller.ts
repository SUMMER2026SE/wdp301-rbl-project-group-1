import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryResult } from '../../../../shared/domain/common/query';
import { ApiOkResponseQueryWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { QueryResponse } from '../../../../shared/presentation/responses/query-response';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { GetTutorsQuery } from '../../application/queries/get-tutors/get-tutors.query';
import {
  GetTutorsResult,
  GetTutorsResultData,
} from '../../application/queries/get-tutors/get-tutors.result';
import { TutorPaginatedParams } from '../../domain/repositories/tutor.repository.interface';
import {
  GetTutorsQueryDto,
  GetTutorsQueryParams,
} from '../schemas/get-tutors-query.dto';
import { TutorResponseDto } from '../schemas/tutor-response.dto';

@ApiTags('Tutors')
@Controller('tutors')
export class TutorController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @Public()
  @ApiOperation({
    operationId: 'getTutors',
    summary: 'Get tutors',
    description:
      'Returns a paginated list of tutors. Supports search by nickname or specialization and filters by specialization, price.',
  })
  @ApiOkResponseQueryWrapped(TutorResponseDto, {
    description: 'List of tutors returned successfully.',
  })
  async getTutors(@Query() dto: GetTutorsQueryDto): Promise<GetTutorsResult> {
    const query: GetTutorsQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const params: TutorPaginatedParams = {
      page,
      limit,
      skip: (page - 1) * limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      specialization: query.specialization,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    };

    const result = await this.queryBus.execute<
      GetTutorsQuery,
      QueryResult<GetTutorsResultData>
    >(new GetTutorsQuery(params));

    return QueryResponse.query(result);
  }
}
