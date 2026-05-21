import { Profile } from '../entities/profile.entity';

export const IProfileRepository = Symbol('IProfileRepository');
export interface IProfileRepository {
  save(profile: Profile): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
}
