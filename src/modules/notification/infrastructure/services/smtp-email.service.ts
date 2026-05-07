import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import hbs from 'nodemailer-express-handlebars';
import {
  IEmailService,
  SendEmailPayload,
} from '../../application/services/smtp-email.interface';

@Injectable()
export class SmtpEmailService implements IEmailService {
  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: hbs.HbsTransporter,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(payload: SendEmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: payload.to,
      subject: payload.subject,
      template: payload.template,
      context: payload.context,
    });
  }
}
