import { Injectable } from '@nestjs/common';
import { MeetingService } from '../../../meeting/application/services/meeting.service';
import { ILessonMeetingService } from '../../domain/interfaces/meeting-service.interface';

@Injectable()
export class LessonMeetingServiceAdapter implements ILessonMeetingService {
  constructor(private readonly meetingService: MeetingService) {}

  async createMeetingForLesson(
    tutorId: string,
    title: string,
    startTime: Date,
    endTime: Date,
  ) {
    return this.meetingService.createMeeting(
      tutorId,
      title,
      startTime,
      endTime,
    );
  }
}
