import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMessageCommand } from './send-message.command';
import { ChatService } from '../../services/chat.service';
import { ChatGateway } from '../../../presentation/gateways/chat.gateway';
import { NotFoundException } from '@nestjs/common';
import { NotificationGateway } from '../../../../notification/presentation/gateways/notification.gateway';
import { NotificationService } from '../../../../notification/application/services/notification.service';
import { NotificationType } from '../../../../../shared/domain/enums/enums';

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler implements ICommandHandler<SendMessageCommand> {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
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
    this.chatGateway.server
      .to(dto.conversationId)
      .emit('new_message', savedMessage);

    // Notify other participants (not the sender) via notification gateway
    const recipientIds = await this.chatService.getOtherParticipantIds(
      senderId,
      dto.conversationId,
    );

    if (recipientIds.length > 0) {
      // Persist notification record
      const notification = await this.notificationService.create({
        title: savedMessage.sender?.nickname ?? 'Tin nhắn mới',
        content:
          dto.content.length > 100
            ? dto.content.substring(0, 97) + '...'
            : dto.content,
        body: {
          conversationId: dto.conversationId,
          messageId: savedMessage.id,
        },
        type: NotificationType.CHAT,
        recipientIds,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      // Push realtime notification to each recipient's personal room
      for (const userId of recipientIds) {
        this.notificationGateway.notifyUser(userId, {
          id: notification.id,
          title: notification.title,
          content: notification.content,
          body: notification.body,
          type: notification.type,
          isRead: false,
          createdAt: notification.createdAt.toISOString(),
        });
      }
    }

    return savedMessage;
  }
}
