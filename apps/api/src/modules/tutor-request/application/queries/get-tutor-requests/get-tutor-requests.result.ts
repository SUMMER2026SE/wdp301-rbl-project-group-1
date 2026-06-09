import { QueryParams } from '../../../../../shared/domain/common/query';
import {
  RequestStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';
import { QueryApiResponse } from '../../../../../shared/presentation/responses/query-response';

export interface TutorRequestPaginatedParams extends QueryParams {
  studentId?: string;
  subjectIds?: string[];
  gradeIds?: string[];
  mode?: TutoringMode;
  status?: RequestStatus;
}

export interface TutorRequestResultData {
  id: string;
  studentId: string;
  subjectId: string | null;
  gradeId: string | null;
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
  grade: {
    id: string;
    name: string;
    slug: string;
    order: number;
  } | null;
  bidCount: number;
  scheduleRules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

export type GetTutorRequestsResult = QueryApiResponse<TutorRequestResultData>;
