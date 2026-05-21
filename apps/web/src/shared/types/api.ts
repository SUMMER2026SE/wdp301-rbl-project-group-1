export type AppResponse<T> = {
  status: number;
  message?: string;
  data: T;
};

export type AppError = {
  data: {
    status?: number;
    error?: string;
    message?: string;
    stack?: string;
    details?: unknown;
  };
};
