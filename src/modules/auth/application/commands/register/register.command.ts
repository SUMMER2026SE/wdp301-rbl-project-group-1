import { UserRole } from '../../../../../shared/domain/enums/enums';

export interface StudentRegisterData {
  school?: string;
  learningGoal?: string;
  subjectIds: string[];
  gradeIds: string[];
}

export class RegisterCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly nickname: string,
    public readonly phone: string,
    public readonly dateOfBirth: Date,
    public readonly studentData?: StudentRegisterData,
  ) {}
}
