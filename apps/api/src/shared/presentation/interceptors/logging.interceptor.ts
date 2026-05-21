import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      ip: string;
    }>();

    const { method, url, ip } = request;
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url} [${ip}]`);

    return next.handle().pipe(
      tap({
        next: () => {
          const elapsed = Date.now() - startTime;
          this.logger.log(`← ${method} ${url} — ${elapsed}ms`);
        },
        error: (error: { message?: string }) => {
          const elapsed = Date.now() - startTime;
          this.logger.error(
            `✗ ${method} ${url} — ${elapsed}ms | ${error?.message ?? 'Unknown error'}`,
          );
        },
      }),
    );
  }
}
