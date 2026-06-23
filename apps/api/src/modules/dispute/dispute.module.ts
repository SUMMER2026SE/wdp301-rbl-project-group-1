import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDisputeHandler } from './application/commands/create-dispute/create-dispute.handler';
import { DisputeSessionHandler } from './application/commands/dispute-session/dispute-session.handler';
import { ResolveDisputeHandler } from './application/commands/resolve-dispute/resolve-dispute.handler';
import { SendDisputeMessageHandler } from './application/commands/send-dispute-message/send-dispute-message.handler';
import { AdminDisputeController } from './presentation/controllers/admin-dispute.controller';
import { DisputeSessionController } from './presentation/controllers/dispute-session.controller';
import { DisputeController } from './presentation/controllers/dispute.controller';

const CommandHandlers = [
  CreateDisputeHandler,
  DisputeSessionHandler,
  ResolveDisputeHandler,
  SendDisputeMessageHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [
    DisputeController,
    DisputeSessionController,
    AdminDisputeController,
  ],
  providers: [...CommandHandlers],
})
export class DisputeModule {}
