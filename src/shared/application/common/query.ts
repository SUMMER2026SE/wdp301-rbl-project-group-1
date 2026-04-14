export type QueryValue = string | string[] | undefined;

export type QuerySortOrder = 'asc' | 'desc';

export interface QueryRequest {
  page?: QueryValue;
  limit?: QueryValue;
  search?: QueryValue;
  sortBy?: QueryValue;
  sortOrder?: QueryValue;
  [key: string]: QueryValue;
}

export interface QueryParams {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  sortOrder?: QuerySortOrder;
  filters?: Record<string, string>;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function createQueryResult<T>(
  data: T[],
  total: number,
  params: QueryParams,
): QueryResult<T> {
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}
