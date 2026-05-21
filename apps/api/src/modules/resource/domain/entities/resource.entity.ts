import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { ResourceType } from '../value-objects/resource-type';

export interface ResourceProps {
  userId: string;
  name: string;
  url: string;
  type: ResourceType;
  size?: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Resource extends AggregateRoot<string> {
  private props: ResourceProps;

  private constructor(id: string, props: ResourceProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: ResourceProps): Resource {
    return new Resource(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get url(): string {
    return this.props.url;
  }

  get type(): ResourceType {
    return this.props.type;
  }

  get size(): number | null | undefined {
    return this.props.size;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }
}
