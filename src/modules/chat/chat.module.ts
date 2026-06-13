import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ChatGateway } from './presentation/gateways/chat.gateway';
import { ChatService } from './application/services/chat.service';
import { WsJwtGuard } from '../../shared/presentation/guards/ws-jwt.guard';
import { ConversationController } from './presentation/controllers/conversation.controller';

// Commands
import { CreateConversationHandler } from './application/commands/create-conversation/create-conversation.handler';
import { MarkReadHandler } from './application/commands/mark-read/mark-read.handler';
import { DeleteMessageHandler } from './application/commands/delete-message/delete-message.handler';

// Queries
import { GetConversationsHandler } from './application/queries/get-conversations/get-conversations.handler';
import { GetMessagesHandler } from './application/queries/get-messages/get-messages.handler';
import { SendMessageCommandHandler } from './application/commands/send-message/send-message.handler';

const CommandHandlers = [
  CreateConversationHandler,
  MarkReadHandler,
  DeleteMessageHandler,
  SendMessageCommandHandler,
];

const QueryHandlers = [GetConversationsHandler, GetMessagesHandler];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secretKey'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ConversationController],
  providers: [
    ChatGateway,
    ChatService,
    WsJwtGuard,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class ChatModule {}
