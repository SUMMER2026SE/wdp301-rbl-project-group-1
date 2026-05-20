import { Tutor } from '../entities/tutor.entity';

export const ITutorRepository = Symbol('ITutorRepository');
export interface ITutorRepository {
  findByUserId(userId: string): Promise<Tutor | null>;
  save(tutor: Tutor): Promise<void>;
}
