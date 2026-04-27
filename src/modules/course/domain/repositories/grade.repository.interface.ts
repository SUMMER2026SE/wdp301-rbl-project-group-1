import { Grade } from '../entities/grade.entity';

export const IGradeRepository = Symbol('IGradeRepository');

export interface IGradeRepository {
  create(grade: Grade): Promise<Grade>;
  findAll(): Promise<Grade[]>;
}
