import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AppLogger } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const now = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<{
      method: string;
      url: string;
      ip?: string;
      headers?: Record<string, string | string[] | undefined>;
    }>();
    const response = http.getResponse<{ statusCode?: number }>();

    const method = request.method;
    const url = request.url;
    const userAgent = this.getHeader(request.headers, 'user-agent');
    const requestId = this.getHeader(request.headers, 'x-request-id');

    return next.handle().pipe(
      tap(() => {
        this.logger.logRequest({
          method,
          url,
          statusCode: response.statusCode,
          durationMs: Date.now() - now,
          ip: request.ip,
          userAgent,
          requestId,
        });
      }),
      catchError((error: unknown) => {
        this.logger.logError(
          {
            method,
            url,
            statusCode:
              error instanceof HttpException
                ? error.getStatus()
                : (response.statusCode ?? 500),
            durationMs: Date.now() - now,
            ip: request.ip,
            userAgent,
            requestId,
          },
          error,
        );

        return throwError(() => error);
      }),
    );
  }

  private getHeader(
    headers: Record<string, string | string[] | undefined> | undefined,
    key: string,
  ): string | undefined {
    const value = headers?.[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return value;
  }
}
