import { QueryApiResponse } from '../../../../../shared/presentation/responses/query-response';

export interface GetUsersResultData {
  id: string;
  email: string;
  role: string;
  nickname: string | null;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: Date;
}

export type GetUsersResult = QueryApiResponse<GetUsersResultData>;
