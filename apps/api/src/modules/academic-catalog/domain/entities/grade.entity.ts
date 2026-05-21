import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';

export interface GradeProps {
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
}

export class Grade extends AggregateRoot<string> {
  private props: GradeProps;

  private constructor(id: string, props: GradeProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: GradeProps): Grade {
    return new Grade(id, props);
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get order(): number {
    return this.props.order;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
