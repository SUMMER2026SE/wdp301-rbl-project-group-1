import { QueryResult } from '../../domain/common/query';

export interface QueryApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class QueryResponse {
  static query<T>(
    result: QueryResult<T>,
    message = 'Success',
  ): QueryApiResponse<T> {
    return {
      success: true,
      message,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
}
