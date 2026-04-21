import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import {
  IEmailService,
  SendEmailPayload,
} from '../../application/services/smtp-email.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmtpEmailService implements IEmailService {
  constructor(
    @Inject('MAIL_TRANSPORTER')
    private readonly transporter: Transporter,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(payload: SendEmailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
  }
}
