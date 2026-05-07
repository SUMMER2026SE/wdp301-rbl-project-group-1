import { Subject } from '../entities/subject.entity';

export const ISubjectRepository = Symbol('ISubjectRepository');

export interface ISubjectRepository {
  create(subject: Subject): Promise<Subject>;
  findAll(): Promise<Subject[]>;
}
