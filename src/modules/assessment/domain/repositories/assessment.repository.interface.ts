import { Assessment } from '../entities/assessment.entity';
import { AssessmentBankConfig } from '../entities/assessment-bank-config.entity';

export const IAssessmentRepository = Symbol('IAssessmentRepository');

export interface IAssessmentRepository {
  create(assessment: Assessment): Promise<Assessment>;
  findById(id: string): Promise<Assessment | null>;
  findByCourseId(courseId: string): Promise<Assessment[]>;
  findByLessonId(lessonId: string): Promise<Assessment[]>;
  update(assessment: Assessment): Promise<Assessment>;
  delete(id: string): Promise<void>;

  // Bank configs
  addBankConfig(config: AssessmentBankConfig): Promise<AssessmentBankConfig>;
  findBankConfigsByAssessmentId(
    assessmentId: string,
  ): Promise<AssessmentBankConfig[]>;
  deleteBankConfig(id: string): Promise<void>;
  deleteBankConfigsByAssessmentId(assessmentId: string): Promise<void>;
}
