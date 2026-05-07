import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IEmailService } from '../../services/smtp-email.interface';
import { SendEmailCommand } from './send-email.command';

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  constructor(
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async execute(command: SendEmailCommand): Promise<void> {
    const { to, subject, template, context } = command;

    await this.emailService.sendEmail({
      to,
      subject,
      template,
      context,
    });
  }
}
