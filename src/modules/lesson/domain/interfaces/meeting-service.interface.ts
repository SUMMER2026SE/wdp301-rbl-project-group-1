export const ILessonMeetingService = Symbol('ILessonMeetingService');

export interface ILessonMeetingService {
  createMeetingForLesson(
    tutorId: string,
    title: string,
    startTime: Date,
    endTime: Date,
  ): Promise<{ meetingUrl: string }>;
}
