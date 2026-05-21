import { FindTutorApplicationsParams } from '../../../domain/repositories/tutor-application.repository';

export class GetTutorApplicationQuery {
  constructor(public readonly query: FindTutorApplicationsParams) {}
}
