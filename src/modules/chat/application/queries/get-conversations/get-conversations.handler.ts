import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetConversationsQuery } from './get-conversations.query';
import { ConversationResultData } from './get-conversations.result';

@QueryHandler(GetConversationsQuery)
export class GetConversationsHandler implements IQueryHandler<GetConversationsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetConversationsQuery,
  ): Promise<ConversationResultData[]> {
    const { userId } = query;

    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        participants: {
          include: {
            user: { select: { id: true, nickname: true, avatarUrl: true } },
          },
        },
        messages: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return conversations.map((conv) => {
      const lastMessage = conv.messages[0] ?? null;

      // unreadCount can be enriched later with a separate query if needed
      const unreadCount = 0;

      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        avatarUrl: conv.avatarUrl,
        updatedAt: conv.updatedAt,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              createdAt: lastMessage.createdAt,
            }
          : null,
        unreadCount,
        participants: conv.participants
          .filter((p) => p.userId !== userId)
          .map((p) => ({
            userId: p.user.id,
            nickname: p.user.nickname,
            avatarUrl: p.user.avatarUrl,
          })),
      };
    });
  }
}
