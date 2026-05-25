import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GradebookRecord } from '../../../domain/entities/gradebook-record.entity';
import { IGradebookRepository } from '../../../domain/repositories/gradebook.repository.interface';
import { GetGradebookQuery } from './get-gradebook.query';

@QueryHandler(GetGradebookQuery)
export class GetGradebookQueryHandler implements IQueryHandler<GetGradebookQuery> {
  constructor(
    @Inject(IGradebookRepository)
    private readonly gradebookRepository: IGradebookRepository,
  ) {}

  async execute(query: GetGradebookQuery): Promise<GradebookRecord[]> {
    return this.gradebookRepository.findByStudentAndCourse(
      query.studentId,
      query.courseId,
    );
  }
}
