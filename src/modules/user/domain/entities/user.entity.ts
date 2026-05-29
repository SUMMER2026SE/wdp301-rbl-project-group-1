import { AggregateRoot } from '../../../../shared/domain/entities/aggregate-root';
import { Gender, UserRole } from '../../../../shared/domain/enums/enums';
import { Tutor } from './tutor.entity';

export interface UserProps {
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: Date;

  // Profile fields (merged from Profile model)
  nickname?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  address?: string | null;

  // Student fields (merged from Student model)
  school?: string | null;
  learningGoal?: string | null;

  tutor?: Tutor | null;
}

export class User extends AggregateRoot<string> {
  private props: UserProps;

  private constructor(id: string, props: UserProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: UserProps): User {
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

  // --- Profile getters ---

  get nickname(): string | null | undefined {
    return this.props.nickname;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get phone(): string | null | undefined {
    return this.props.phone;
  }

  get dateOfBirth(): Date | null | undefined {
    return this.props.dateOfBirth;
  }

  get gender(): Gender | null | undefined {
    return this.props.gender;
  }

  get address(): string | null | undefined {
    return this.props.address;
  }

  // --- Student getters ---

  get school(): string | null | undefined {
    return this.props.school;
  }

  get learningGoal(): string | null | undefined {
    return this.props.learningGoal;
  }

  // --- Relations ---

  get tutor(): Tutor | null | undefined {
    return this.props.tutor;
  }

  // --- Mutations ---

  updatePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
  }

  updateEmail(email: string): void {
    this.props.email = email;
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

  upgradeToTutor(): void {
    this.props.role = UserRole.TUTOR;
  }

  /** Update profile fields (nickname, avatar, phone, etc.) */
  updateProfile(params: {
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

  /** Update student-specific fields */
  updateStudentProfile(
    school: string | null,
    learningGoal: string | null,
  ): void {
    this.props.school = school;
    this.props.learningGoal = learningGoal;
  }
}
