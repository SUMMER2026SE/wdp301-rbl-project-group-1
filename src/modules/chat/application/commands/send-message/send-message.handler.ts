import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { ChatService } from '../../services/chat.service';
import { ChatGateway } from '../../../presentation/gateways/chat.gateway';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler implements ICommandHandler<SendMessageCommand> {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async execute(command: SendMessageCommand) {
    const { senderId, dto } = command;

    const isParticipant = await this.chatService.verifyParticipant(
      senderId,
      dto.conversationId,
    );
    if (!isParticipant) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    const savedMessage = await this.chatService.saveMessage(senderId, dto);

    // Emit via WebSocket to all connected clients in the conversation room
    this.chatGateway.server.to(dto.conversationId).emit('new_message', savedMessage);

    return savedMessage;
  }
}
