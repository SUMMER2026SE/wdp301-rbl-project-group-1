import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { SendEmailHandler } from './application/commands/send-email/send-email.handler';
import { SmtpEmailService } from './infrastructure/services/smtp-email.service';
import { MailerProvider } from './infrastructure/providers/mail/mailer.provider';

const CommandHandlers = [SendEmailHandler];

@Module({
  imports: [CqrsModule, ConfigModule],
  providers: [
    MailerProvider,
    ...CommandHandlers,
    {
      provide: 'IEmailService',
      useClass: SmtpEmailService,
    },
  ],
})
export class NotificationModule {}
