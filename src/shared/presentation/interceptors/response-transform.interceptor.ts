import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryResult } from '../../application/common/query';
import { BaseResponse } from '../responses/base-response';
import { QueryApiResponse, QueryResponse } from '../responses/query-response';

type AnyResponse<T> = BaseResponse<T> | QueryApiResponse<T>;

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
        if (data instanceof BaseResponse || this.isQueryResponse(data)) {
          return data as AnyResponse<T>;
        }

        if (this.isQueryResult(data)) {
          return QueryResponse.query(data) as AnyResponse<T>;
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

  private isQueryResponse(data: unknown): data is QueryApiResponse<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      'meta' in data &&
      'data' in data
    );
  }

  private isQueryResult(data: unknown): data is QueryResult<unknown> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'total' in data &&
      'page' in data &&
      'limit' in data &&
      'totalPages' in data &&
      !('success' in data)
    );
  }
}
