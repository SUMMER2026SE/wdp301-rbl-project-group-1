import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { User } from '../../../user/domain/entities/user.entity';

export interface RefreshTokenProps {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;

  user?: User | null;
}

export class RefreshToken extends AggregateRoot<string> {
  private props: RefreshTokenProps;

  private constructor(id: string, props: RefreshTokenProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get revoked(): boolean {
    return this.props.revoked;
  }

  get user(): User | null | undefined {
    return this.props.user;
  }

  isExpired(now: Date = new Date()): boolean {
    return this.props.expiresAt <= now;
  }

  revoke(): void {
    this.props.revoked = true;
  }

  setUser(user: User): void {
    this.props.user = user;
  }
}
