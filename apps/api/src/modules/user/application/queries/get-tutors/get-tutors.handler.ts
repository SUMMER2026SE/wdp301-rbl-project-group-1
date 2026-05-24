import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { ITutorRepository } from '../../../domain/repositories/tutor.repository.interface';
import { GetTutorsQuery } from './get-tutors.query';
import { GetTutorsResultData } from './get-tutors.result';

@QueryHandler(GetTutorsQuery)
export class GetTutorsQueryHandler
  implements
    IQueryHandler<GetTutorsQuery>,
    IQuery<GetTutorsQuery, QueryResult<GetTutorsResultData>>
{
  constructor(
    @Inject(ITutorRepository)
    private readonly tutorRepository: ITutorRepository,
  ) {}

  async execute(
    query: GetTutorsQuery,
  ): Promise<QueryResult<GetTutorsResultData>> {
    const { params } = query;
    const result = await this.tutorRepository.findAll(params);

    const data: GetTutorsResultData[] = result.data.map(
      ({ tutor, profile }) => ({
        id: tutor.userId,
        nickname: profile.nickname ?? null,
        avatarUrl: profile.avatarUrl ?? null,
        bio: tutor.bio ?? null,
        specialization: tutor.specialization ?? null,
        experience: tutor.experience ?? null,
        education: tutor.education ?? null,
        pricePerHour: tutor.pricePerHour ?? null,
        rating: tutor.rating ?? 0,
        reviewCount: tutor.reviewCount ?? 0,
        studentCount: tutor.studentCount ?? 0,
      }),
    );

    return createQueryResult(data, result.total, params);
  }
}
