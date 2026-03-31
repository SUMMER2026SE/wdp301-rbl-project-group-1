import { PaginatedResult } from './pagination';

export class BaseResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T | null;

  private constructor(success: boolean, message: string, data: T | null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(data: T, message = 'Success'): BaseResponse<T> {
    return new BaseResponse(true, message, data);
  }

  static created<T>(
    data: T,
    message = 'Created successfully',
  ): BaseResponse<T> {
    return new BaseResponse(true, message, data);
  }

  static noContent(message = 'Deleted successfully'): BaseResponse<null> {
    return new BaseResponse(true, message, null);
  }

  static paginated<T>(
    result: PaginatedResult<T>,
    message = 'Success',
  ): PaginatedResponse<T> {
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

  static error(
    message: string,
    errors?: Record<string, string>,
  ): ErrorResponse {
    return {
      success: false,
      message,
      errors: errors ?? null,
    };
  }
}

export interface PaginatedResponse<T> {
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

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors: Record<string, string> | null;
}
