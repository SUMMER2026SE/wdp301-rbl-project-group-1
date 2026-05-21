export const IMeetingProvider = Symbol('IMeetingProvider');

export interface CreateMeetingInput {
  tutorId: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface CreateMeetingResult {
  meetingUrl: string;
  externalId: string;
}

export interface IMeetingProvider {
  createMeeting(input: CreateMeetingInput): Promise<CreateMeetingResult>;

  updateMeeting?(): Promise<void>;

  cancelMeeting?(externalId: string): Promise<void>;
}
