import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './exception.filter';
import { AppLogger } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
