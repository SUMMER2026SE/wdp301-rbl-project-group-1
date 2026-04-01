import { BaseEntity } from '../../../../shared/domain/entities/base-entity';

export interface ParentProps {
  userId: number;
  phone?: string | null;
  address?: string | null;
}

export class Parent extends BaseEntity<number> {
  private props: ParentProps;

  private constructor(id: number, props: ParentProps) {
    super(id);
    this.props = props;
  }

  static create(id: number, props: ParentProps): Parent {
    return new Parent(id, props);
  }

  get userId(): number {
    return this.props.userId;
  }

  get phone(): string | null | undefined {
    return this.props.phone;
  }

  get address(): string | null | undefined {
    return this.props.address;
  }

  updateProfile(phone: string | null, address: string | null): void {
    this.props.phone = phone;
    this.props.address = address;
  }
}
