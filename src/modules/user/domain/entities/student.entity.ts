import { BaseEntity } from '../../../../shared/domain/entities/base-entity';

export interface StudentProps {
  userId: string;
  grade?: string | null;
  school?: string | null;
  learningGoal?: string | null;
}

export class Student extends BaseEntity<string> {
  private props: StudentProps;

  private constructor(id: string, props: StudentProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: StudentProps): Student {
    return new Student(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get grade(): string | null | undefined {
    return this.props.grade;
  }

  get school(): string | null | undefined {
    return this.props.school;
  }

  get learningGoal(): string | null | undefined {
    return this.props.learningGoal;
  }

  updateProfile(
    grade: string | null,
    school: string | null,
    learningGoal: string | null,
  ): void {
    this.props.grade = grade;
    this.props.school = school;
    this.props.learningGoal = learningGoal;
  }
}
