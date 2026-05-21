export interface IEmailService {
  sendEmail(payload: SendEmailPayload): Promise<void>;
}

export type SendEmailPayload = {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
};
