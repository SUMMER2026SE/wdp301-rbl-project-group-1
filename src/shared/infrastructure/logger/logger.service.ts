import { Injectable, Logger } from '@nestjs/common';

type HttpLogContext = {
  method: string;
  url: string;
  statusCode?: number;
  durationMs?: number;
  ip?: string;
  userAgent?: string;
  requestId?: string;
};

@Injectable()
export class AppLogger extends Logger {
  logRequest(context: HttpLogContext) {
    this.log(this.buildHttpMessage(context), 'HTTP');
  }

  logError(context: HttpLogContext, error: unknown) {
    const stack = error instanceof Error ? error.stack : undefined;
    const message =
      error instanceof Error
        ? `${this.buildHttpMessage(context)} - ${error.message}`
        : this.buildHttpMessage(context);

    this.error(message, stack, 'HTTP');
  }

  private buildHttpMessage(context: HttpLogContext): string {
    const parts = [
      `${context.method} ${context.url}`,
      context.statusCode !== undefined ? `${context.statusCode}` : undefined,
      context.durationMs !== undefined ? `${context.durationMs}ms` : undefined,
      context.ip ? `ip=${context.ip}` : undefined,
      context.requestId ? `reqId=${context.requestId}` : undefined,
      context.userAgent ? `ua=${context.userAgent}` : undefined,
    ].filter(Boolean);

    return parts.join(' | ');
  }
}
