import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { CreateReviewResult } from '../../application/commands/create-review/create-review.result';
import { ReviewResultData } from '../../application/queries/get-tutor-reviews/get-tutor-reviews.result';

export const CreateReviewResponseSchema = z
  .object({
    id: z.string(),
    bookingId: z.string(),
    tutorId: z.string(),
    studentId: z.string(),
    rating: z.number().int(),
    comment: z.string().nullable(),
    createdAt: z.string().datetime(),
  })
  .meta({ id: 'CreateReviewResponseDto' });

export class CreateReviewResponseDto extends createZodDto(
  CreateReviewResponseSchema,
) {
  static fromResult(result: CreateReviewResult): CreateReviewResponseDto {
    const dto = new CreateReviewResponseDto();
    dto.id = result.id;
    dto.bookingId = result.bookingId;
    dto.tutorId = result.tutorId;
    dto.studentId = result.studentId;
    dto.rating = result.rating;
    dto.comment = result.comment;
    dto.createdAt = result.createdAt;
    return dto;
  }
}

export const ReviewResponseSchema = z
  .object({
    id: z.string(),
    bookingId: z.string(),
    tutorId: z.string(),
    studentId: z.string(),
    rating: z.number().int(),
    comment: z.string().nullable(),
    createdAt: z.string().datetime(),
    student: z.object({
      id: z.string(),
      nickname: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    }),
  })
  .meta({ id: 'ReviewResponseDto' });

export class ReviewResponseDto extends createZodDto(ReviewResponseSchema) {
  static fromResult(result: ReviewResultData): ReviewResponseDto {
    const dto = new ReviewResponseDto();
    dto.id = result.id;
    dto.bookingId = result.bookingId;
    dto.tutorId = result.tutorId;
    dto.studentId = result.studentId;
    dto.rating = result.rating;
    dto.comment = result.comment;
    dto.createdAt = result.createdAt.toISOString();
    dto.student = result.student;
    return dto;
  }
}
