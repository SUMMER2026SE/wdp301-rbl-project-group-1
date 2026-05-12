import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { TutorApplicationStatus } from '../enums/tutor-application';

export interface TutorApplicationProps {
  email: string;
  userId?: string | null;
  bio?: string;
  specialization: string;
  experience?: number;
  education?: string;
  pricePerHour?: number;
  status: TutorApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TutorApplication extends AggregateRoot<string> {
  private props: TutorApplicationProps;

  private constructor(id: string, props: TutorApplicationProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: TutorApplicationProps): TutorApplication {
    return new TutorApplication(id, props);
  }

  get email(): string {
    return this.props.email;
  }

  get userId(): string | null | undefined {
    return this.props.userId;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get specialization(): string {
    return this.props.specialization;
  }

  get experience(): number | undefined {
    return this.props.experience;
  }

  get education(): string | undefined {
    return this.props.education;
  }

  get pricePerHour(): number | undefined {
    return this.props.pricePerHour;
  }

  get status(): TutorApplicationStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  approve(): void {
    if (this.props.status !== 'PENDING') {
      throw new Error(
        `Cannot approve application with status '${this.props.status}'`,
      );
    }
    this.props.status = 'APPROVED';
    this.props.updatedAt = new Date();
  }

  reject(): void {
    if (this.props.status !== 'PENDING') {
      throw new Error(
        `Cannot reject application with status '${this.props.status}'`,
      );
    }
    this.props.status = 'REJECTED';
    this.props.updatedAt = new Date();
  }

  linkUser(userId: string): void {
    this.props.userId = userId;
  }
}
