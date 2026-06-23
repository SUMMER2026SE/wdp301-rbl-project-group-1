import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryResult } from '../../../../shared/domain/common/query';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrappedNoData,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import {
  QueryApiResponse,
  QueryResponse,
} from '../../../../shared/presentation/responses/query-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { Roles } from '../../../auth/presentation/decorators/role.decorator';
import { CreateReviewCommand } from '../../application/commands/create-review/create-review.command';
import { CreateReviewResult } from '../../application/commands/create-review/create-review.result';
import { DeleteReviewCommand } from '../../application/commands/delete-review/delete-review.command';
import { GetTutorReviewsQuery } from '../../application/queries/get-tutor-reviews/get-tutor-reviews.query';
import { ReviewResultData } from '../../application/queries/get-tutor-reviews/get-tutor-reviews.result';
import { CreateReviewDto } from '../schemas/create-review.dto';
import {
  GetTutorReviewsQueryDto,
  GetTutorReviewsQueryParams,
} from '../schemas/get-tutor-reviews-query.dto';
import {
  CreateReviewResponseDto,
  ReviewResponseDto,
} from '../schemas/review-response.dto';

@ApiTags('Review')
@Controller()
export class ReviewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('bookings/:bookingId/reviews')
  @Roles(UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'createBookingReview',
    summary: 'Create review for a completed booking',
  })
  @ApiCreatedResponseWrapped(CreateReviewResponseDto, {
    description: 'Review created successfully.',
  })
  async createReview(
    @CurrentUser() user: { userId: string },
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<BaseResponse<CreateReviewResponseDto>> {
    const result = await this.commandBus.execute<
      CreateReviewCommand,
      CreateReviewResult
    >(
      new CreateReviewCommand(
        bookingId,
        user.userId,
        dto.rating,
        dto.comment ?? null,
      ),
    );

    return BaseResponse.created(CreateReviewResponseDto.fromResult(result));
  }

  @Get('tutors/:tutorId/reviews')
  @Public()
  @ApiOperation({
    operationId: 'getTutorReviews',
    summary: 'Get reviews of a tutor',
  })
  @ApiOkResponseQueryWrapped(ReviewResponseDto, {
    description: 'Tutor reviews returned successfully.',
  })
  async getTutorReviews(
    @Param('tutorId') tutorId: string,
    @Query() dto: GetTutorReviewsQueryDto,
  ): Promise<QueryApiResponse<ReviewResponseDto>> {
    const query: GetTutorReviewsQueryParams = dto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.queryBus.execute<
      GetTutorReviewsQuery,
      QueryResult<ReviewResultData>
    >(
      new GetTutorReviewsQuery({
        tutorId,
        page,
        limit,
        skip: (page - 1) * limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      }),
    );

    const mappedData = result.data.map((item) =>
      ReviewResponseDto.fromResult(item),
    );
    return QueryResponse.query({ ...result, data: mappedData });
  }

  @Delete('admin/reviews/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'deleteReviewByAdmin',
    summary: 'Delete a review by id',
  })
  @ApiOkResponseWrappedNoData({
    description: 'Review deleted successfully.',
  })
  async deleteReview(@Param('id') id: string): Promise<BaseResponse<null>> {
    await this.commandBus.execute(new DeleteReviewCommand(id));
    return BaseResponse.noContent();
  }
}
