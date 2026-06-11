import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { ApiOkResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { GetRecommendedTutorsQuery } from '../../application/queries/get-recommended-tutors/get-recommended-tutors.query';
import type { GetRecommendedTutorsResult } from '../../application/queries/get-recommended-tutors/get-recommended-tutors.result';
import { RecommendedTutorItemDto } from '../schemas/recommendation-response.dto';

@ApiTags('Recommendations')
@Controller('recommendations')
@ApiBearerAuth()
export class RecommendationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('tutors')
  @ApiOperation({
    operationId: 'getRecommendedTutors',
    summary: 'Get personalized tutor recommendations for the current user',
    description:
      'Returns a list of tutors ranked by similarity to the user preference vector from the AI service.',
  })
  @ApiOkResponseWrapped(RecommendedTutorItemDto, { isArray: true })
  async getRecommendedTutors(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<GetRecommendedTutorsResult>> {
    const result = await this.queryBus.execute<
      GetRecommendedTutorsQuery,
      GetRecommendedTutorsResult
    >(new GetRecommendedTutorsQuery(user.userId));

    return BaseResponse.ok(result);
  }
}
