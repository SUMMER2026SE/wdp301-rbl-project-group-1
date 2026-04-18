import { Profile } from '../entities/profile.entity';

export abstract class IProfileRepository {
  abstract save(profile: Profile): Promise<Profile>;
  abstract findByUserId(userId: number): Promise<Profile | null>;
}
