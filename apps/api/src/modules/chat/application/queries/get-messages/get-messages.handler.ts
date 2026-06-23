import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetMessagesQuery } from './get-messages.query';
import { MessageResultData } from './get-messages.result';

@QueryHandler(GetMessagesQuery)
export class GetMessagesHandler implements IQueryHandler<GetMessagesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetMessagesQuery,
  ): Promise<QueryResult<MessageResultData>> {
    const { conversationId, limit, skip } = query.params;

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where: { conversationId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: {
          sender: {
            select: { id: true, nickname: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.message.count({
        where: { conversationId, isDeleted: false },
      }),
    ]);

    const data: MessageResultData[] = messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      content: msg.content,
      type: msg.type,
      fileUrl: msg.fileUrl,
      replyToId: msg.replyToId,
      isDeleted: msg.isDeleted,
      createdAt: msg.createdAt,
      sender: msg.sender
        ? {
            id: msg.sender.id,
            nickname: msg.sender.nickname,
            avatarUrl: msg.sender.avatarUrl,
          }
        : null,
    }));

    return createQueryResult(data, total, query.params);
  }
}
