import { Gender, UserRole } from '../../../../../shared/domain/enums/enums';

export interface PublicProfileResult {
  nickname: string | null;
  avatarUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null; // ISO date string "YYYY-MM-DD"
  gender: Gender | null;
  address: string | null;
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
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: Date;
  profile: PublicProfileResult | null;
  tutor: TutorProfileResult | null;
  student: StudentProfileResult | null;
  parent: null;
}
