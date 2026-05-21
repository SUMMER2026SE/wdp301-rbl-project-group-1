import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';

export interface SubjectProps {
  name: string;
  slug: string;
  createdAt: Date;
}

export class Subject extends AggregateRoot<string> {
  private props: SubjectProps;

  private constructor(id: string, props: SubjectProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: SubjectProps): Subject {
    return new Subject(id, props);
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
