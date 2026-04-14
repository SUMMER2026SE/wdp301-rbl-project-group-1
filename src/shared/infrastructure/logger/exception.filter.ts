import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppLogger } from './logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();

    const request = ctx.getRequest<{
      method: string;
      url: string;
      ip?: string;
      headers?: Record<string, string | string[] | undefined>;
    }>();
    const response = ctx.getResponse<{
      status: (code: number) => { send: (body: unknown) => void };
    }>();

    const { method, url } = request;
    const requestId = this.getHeader(request.headers, 'x-request-id');
    const userAgent = this.getHeader(request.headers, 'user-agent');

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.logError(
      {
        method,
        url,
        statusCode,
        ip: request.ip,
        userAgent,
        requestId,
      },
      exception,
    );

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path: url,
          };

    response.status(statusCode).send(responseBody);
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
