import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const MailerProvider = {
  provide: 'MAIL_TRANSPORTER',
  useFactory: (
    configService: ConfigService,
  ): Transporter<SMTPTransport.SentMessageInfo> => {
    return createTransport({
      host: configService.getOrThrow<string>('EMAIL_HOST'),
      port: configService.getOrThrow<number>('EMAIL_PORT'),
      auth: {
        user: configService.getOrThrow<string>('EMAIL_USER'),
        pass: configService.getOrThrow<string>('EMAIL_PASS'),
      },
    });
  },
  inject: [ConfigService],
};
