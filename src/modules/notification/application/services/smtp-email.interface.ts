export interface IEmailService {
  sendEmail(payload: SendEmailPayload): Promise<void>;
}

export type SendEmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};
