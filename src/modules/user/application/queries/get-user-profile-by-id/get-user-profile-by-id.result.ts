import { Gender, UserRole } from '../../../../../shared/domain/enums/enums';

export interface PublicProfileResult {
  nickname: string;
  avatarUrl: string | null;
  dateOfBirth: string; // ISO date string "YYYY-MM-DD"
  gender: Gender | null;
}

export interface TutorProfileResult {
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
}

export interface SubjectResult {
  id: string;
  name: string;
  slug: string;
}

export interface GradeResult {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface StudentProfileResult {
  school: string | null;
  learningGoal: string | null;
  subjects: SubjectResult[];
  grades: GradeResult[];
}

export interface GetUserProfileByIdResult {
  id: string;
  role: UserRole;
  createdAt: Date;
  profile: PublicProfileResult | null;
  tutor: TutorProfileResult | null;
  student: StudentProfileResult | null;
}
