import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/database/prisma/prisma.module';
import { MeetingService } from './application/services/meeting.service';
import { IMeetingProvider } from './domain/interfaces/meeting-provider.interface';
import { GoogleMeetProvider } from './infrastructure/providers/google-meet.provider';

@Module({
  imports: [PrismaModule],
  providers: [
    MeetingService,
    {
      provide: IMeetingProvider,
      useClass: GoogleMeetProvider,
    },
  ],
  exports: [MeetingService],
})
export class MeetingModule {}
