import { Gender, UserRole } from '../../../../../shared/domain/enums/enums';

// ─── Profile ─────────────────────────────────────────────────────────────────
export interface UserProfileResult {
  nickname: string | null;
  avatarUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null; // ISO date string "YYYY-MM-DD"
  gender: Gender | null;
  address: string | null;
}

// ─── Role-specific data ───────────────────────────────────────────────────────
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

export interface ParentProfileResult {
  phone: string | null;
  address: string | null;
}

// ─── Final result ─────────────────────────────────────────────────────────────
export interface GetProfileResult {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: Date;
  profile: UserProfileResult | null;
  tutor: TutorProfileResult | null;
  student: StudentProfileResult | null;
  parent: ParentProfileResult | null;
}
