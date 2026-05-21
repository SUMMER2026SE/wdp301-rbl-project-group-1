export class BaseResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;

  private constructor(success: boolean, message: string, data: T) {
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

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors: Record<string, string> | null;
}
