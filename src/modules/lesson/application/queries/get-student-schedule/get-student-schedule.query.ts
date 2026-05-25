import { StudentScheduleParams } from '../../../domain/repositories/lesson.repository.interface';

export class GetStudentScheduleQuery {
  constructor(public readonly params: StudentScheduleParams) {}
}
