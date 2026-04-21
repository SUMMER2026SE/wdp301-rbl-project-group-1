import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SendEmailCommand } from './send-email.command';
import { IEmailService } from '../../services/smtp-email.interface';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  constructor(
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async execute(command: SendEmailCommand): Promise<void> {
    const { to, subject, html } = command;

    await this.emailService.sendEmail({
      to,
      subject,
      html,
    });
  }
}
