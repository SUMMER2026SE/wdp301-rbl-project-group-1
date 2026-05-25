import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Assessment } from '../../../domain/entities/assessment.entity';
import { IAssessmentRepository } from '../../../domain/repositories/assessment.repository.interface';
import { GetAssessmentsQuery } from './get-assessments.query';

@QueryHandler(GetAssessmentsQuery)
export class GetAssessmentsQueryHandler implements IQueryHandler<GetAssessmentsQuery> {
  constructor(
    @Inject(IAssessmentRepository)
    private readonly assessmentRepository: IAssessmentRepository,
  ) {}

  async execute(query: GetAssessmentsQuery): Promise<Assessment[]> {
    if (query.lessonId) {
      return this.assessmentRepository.findByLessonId(query.lessonId);
    }
    return this.assessmentRepository.findByCourseId(query.courseId);
  }
}
