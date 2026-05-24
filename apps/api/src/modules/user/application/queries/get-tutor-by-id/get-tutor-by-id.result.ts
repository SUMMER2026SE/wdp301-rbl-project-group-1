export interface GetTutorByIdResult {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
}
