import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { GetJoinedStudentsQuery } from './get-joined-students.query';
import {
  GetJoinedStudentsResult,
  JoinedStudentDto,
} from './get-joined-students.result';

@QueryHandler(GetJoinedStudentsQuery)
export class GetJoinedStudentsQueryHandler
  implements
    IQueryHandler<GetJoinedStudentsQuery>,
    IQuery<GetJoinedStudentsQuery, GetJoinedStudentsResult>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    query: GetJoinedStudentsQuery,
  ): Promise<GetJoinedStudentsResult> {
    const course = await this.courseRepository.findById(query.courseId);

    if (!course || course.tutorId !== query.tutorId) {
      throw new NotFoundException(`Course with id ${query.courseId} not found`);
    }

    const students = await this.courseRepository.findJoinedStudents(
      query.courseId,
    );

    return new GetJoinedStudentsResult(
      students.map(
        (s) =>
          new JoinedStudentDto(
            s.studentId,
            s.email,
            s.nickname,
            s.avatarUrl,
            s.school,
            s.learningGoal,
            s.status,
            s.enrolledAt,
          ),
      ),
    );
  }
}
