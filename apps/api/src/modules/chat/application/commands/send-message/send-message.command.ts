import { SendMessageDto } from '../../../presentation/schemas/send-message.dto';

export class SendMessageCommand {
  constructor(
    public readonly senderId: string,
    public readonly dto: SendMessageDto,
  ) {}
}
