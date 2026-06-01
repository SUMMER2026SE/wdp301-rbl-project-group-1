import { QueryApiResponse } from '../../../../../shared/presentation/responses/query-response';
import { QueryParams } from '../../../../../shared/domain/common/query';
import {
  RequestStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';

export interface TutorRequestPaginatedParams extends QueryParams {
  subjectId?: string;
  mode?: TutoringMode;
  status?: RequestStatus;
}

export interface TutorRequestResultData {
  id: string;
  studentId: string;
  subjectId: string | null;
  title: string;
  description: string;
  mode: TutoringMode;
  budget: number | null;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  };
  subject: {
    id: string;
    name: string;
    slug: string;
  } | null;
  bidCount: number;
}

export type GetTutorRequestsResult = QueryApiResponse<TutorRequestResultData>;
