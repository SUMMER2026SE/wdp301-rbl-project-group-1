import { QueryApiResponse } from '../../../../../shared/presentation/responses/query-response';

export interface GetTutorsResultData {
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

export type GetTutorsResult = QueryApiResponse<GetTutorsResultData>;
