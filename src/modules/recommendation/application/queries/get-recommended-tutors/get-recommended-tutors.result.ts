export interface RecommendedTutorItem {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
  subjects: { id: string; name: string; slug: string }[];
  grades: { id: string; name: string; slug: string }[];
}

export type GetRecommendedTutorsResult = RecommendedTutorItem[];
