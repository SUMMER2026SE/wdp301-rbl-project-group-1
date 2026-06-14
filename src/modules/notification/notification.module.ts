import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { SendEmailHandler } from './application/commands/send-email/send-email.handler';
import { SmtpEmailService } from './infrastructure/services/smtp-email.service';
import { MailerProvider } from './infrastructure/providers/mail/mailer.provider';
import { NotificationService } from './application/services/notification.service';
import { NotificationGateway } from './presentation/gateways/notification.gateway';
import { NotificationController } from './presentation/controllers/notification.controller';
import { WsJwtGuard } from '../../shared/presentation/guards/ws-jwt.guard';

const CommandHandlers = [SendEmailHandler];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secretKey'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [
    MailerProvider,
    ...CommandHandlers,
    {
      provide: 'IEmailService',
      useClass: SmtpEmailService,
    },
    NotificationService,
    NotificationGateway,
    WsJwtGuard,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
