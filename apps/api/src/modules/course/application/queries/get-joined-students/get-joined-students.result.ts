import { EnrollmentStatus } from '../../../../../shared/domain/enums/enums';

export class JoinedStudentDto {
  constructor(
    public readonly studentId: string,
    public readonly email: string,
    public readonly nickname: string | null,
    public readonly avatarUrl: string | null,
    public readonly school: string | null,
    public readonly learningGoal: string | null,
    public readonly status: EnrollmentStatus,
    public readonly enrolledAt: Date,
  ) {}
}

export class GetJoinedStudentsResult {
  constructor(public readonly students: JoinedStudentDto[]) {}
}
