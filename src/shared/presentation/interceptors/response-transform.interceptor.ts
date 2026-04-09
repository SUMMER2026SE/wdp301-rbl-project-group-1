import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse, PaginatedResponse } from '../responses/base-response';

type AnyResponse<T> = BaseResponse<T> | PaginatedResponse<T>;

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  AnyResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<AnyResponse<T>> {
    const httpResponse = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      map((data) => {
        if (data instanceof BaseResponse || this.isPaginatedResponse(data)) {
          return data as AnyResponse<T>;
        }

        if (data === null || data === undefined) {
          return BaseResponse.noContent() as unknown as AnyResponse<T>;
        }

        if (httpResponse.statusCode === 201) {
          return BaseResponse.created(data) as AnyResponse<T>;
        }

        return BaseResponse.ok(data) as AnyResponse<T>;
      }),
    );
  }

  private isPaginatedResponse(
    data: unknown,
  ): data is PaginatedResponse<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      'meta' in data &&
      'data' in data
    );
  }
}
