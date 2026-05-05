import { TutorApplication } from '../entities/tutor-application.entity';

export const ITutorApplicationRepository = Symbol(
  'ITutorApplicationRepository',
);

export abstract class TutorApplicationRepository {
  abstract create(application: TutorApplication): Promise<TutorApplication>;

  abstract findByEmail(email: string): Promise<TutorApplication | null>;
}
