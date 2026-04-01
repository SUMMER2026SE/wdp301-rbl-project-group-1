import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { Tutor } from './tutor.entity';
import { Student } from './student.entity';
import { Parent } from './parent.entity';

export interface UserProps {
  email: string;
  password?: string;
  role: UserRole;
  nickname?: string | null;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: Date;

  tutor?: Tutor | null;
  student?: Student | null;
  parent?: Parent | null;
}

export class User extends AggregateRoot<number> {
  private props: UserProps;

  private constructor(id: number, props: UserProps) {
    super(id);
    this.props = props;
  }

  static create(id: number, props: UserProps): User {
    return new User(id, props);
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get nickname(): string | null | undefined {
    return this.props.nickname;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  get isFlag(): boolean {
    return this.props.isFlag;
  }

  get reportCount(): number {
    return this.props.reportCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get tutor(): Tutor | null | undefined {
    return this.props.tutor;
  }

  get student(): Student | null | undefined {
    return this.props.student;
  }

  get parent(): Parent | null | undefined {
    return this.props.parent;
  }

  updateProfile(nickname: string): void {
    this.props.nickname = nickname;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  verify(): void {
    this.props.isVerified = true;
  }

  flag(): void {
    this.props.isFlag = true;
  }

  unflag(): void {
    this.props.isFlag = false;
  }

  incrementReportCount(): void {
    this.props.reportCount += 1;
  }

  setTutor(tutor: Tutor): void {
    this.props.tutor = tutor;
  }

  setStudent(student: Student): void {
    this.props.student = student;
  }

  setParent(parent: Parent): void {
    this.props.parent = parent;
  }
}
