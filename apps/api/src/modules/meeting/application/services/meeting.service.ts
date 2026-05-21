import { Inject, Injectable } from '@nestjs/common';
import { IMeetingProvider } from '../../domain/interfaces/meeting-provider.interface';

@Injectable()
export class MeetingService {
  constructor(
    @Inject(IMeetingProvider)
    private readonly provider: IMeetingProvider,
  ) {}

  async createMeeting(
    tutorId: string,
    title: string,
    startTime: Date,
    endTime: Date,
  ) {
    return this.provider.createMeeting({
      tutorId,
      title,
      startTime,
      endTime,
    });
  }
}
