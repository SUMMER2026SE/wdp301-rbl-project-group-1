import {
  UserIdentity,
  type UserIdentityProvider,
} from '../entities/user-identity.entity';

export const IUserIdentityRepository = Symbol('IUserIdentityRepository');

export interface IUserIdentityRepository {
  save(userIdentity: UserIdentity): Promise<UserIdentity>;
  findByProviderAndProviderUserId(
    provider: UserIdentityProvider,
    providerUserId: string,
  ): Promise<UserIdentity | null>;
  findByUserIdAndProvider(
    userId: string,
    provider: UserIdentityProvider,
  ): Promise<UserIdentity | null>;
}
