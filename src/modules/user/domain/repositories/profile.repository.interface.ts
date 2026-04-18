import { Profile } from '../entities/profile.entity';

export abstract class IProfileRepository {
  abstract save(profile: Profile): Promise<Profile>;
  abstract findByUserId(userId: string): Promise<Profile | null>;
}
