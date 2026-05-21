import { BaseEntity } from 'src/shared/domain/entities/base-entity';

export type UserIdentityProvider = string;

export interface UserIdentityProps {
  userId: string;
  provider: UserIdentityProvider;
  providerUserId: string;
  email?: string;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: Date;
}

export class UserIdentity extends BaseEntity<string> {
  private props: UserIdentityProps;

  private constructor(id: string, props: UserIdentityProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: UserIdentityProps): UserIdentity {
    return new UserIdentity(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get provider(): UserIdentityProvider {
    return this.props.provider;
  }

  get providerUserId(): string {
    return this.props.providerUserId;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
