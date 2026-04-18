import { BaseEntity } from 'src/shared/domain/entities/base-entity';
import { Gender } from 'src/shared/domain/enums/enums';

export interface ProfileProps {
  userId: string;
  nickname: string;
  avatarUrl?: string;
  phone: string;
  dateOfBirth: Date;
  gender?: Gender;
  address?: string;
}

export class Profile extends BaseEntity<string> {
  private props: ProfileProps;

  private constructor(id: string, props: ProfileProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: ProfileProps): Profile {
    return new Profile(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get nickname(): string {
    return this.props.nickname;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get phone(): string {
    return this.props.phone;
  }

  get dateOfBirth(): Date {
    return this.props.dateOfBirth;
  }

  get gender(): Gender | undefined {
    return this.props.gender;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  update(params: {
    nickname?: string;
    avatarUrl?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    address?: string;
  }): void {
    if (params.nickname !== undefined) this.props.nickname = params.nickname;
    if (params.avatarUrl !== undefined) this.props.avatarUrl = params.avatarUrl;
    if (params.phone !== undefined) this.props.phone = params.phone;
    if (params.dateOfBirth !== undefined)
      this.props.dateOfBirth = params.dateOfBirth;
    if (params.gender !== undefined) this.props.gender = params.gender;
    if (params.address !== undefined) this.props.address = params.address;
  }
}
