import { TutorScheduleParams } from '../../../domain/repositories/lesson.repository.interface';

export class GetTutorScheduleQuery {
  constructor(public readonly params: TutorScheduleParams) {}
}
