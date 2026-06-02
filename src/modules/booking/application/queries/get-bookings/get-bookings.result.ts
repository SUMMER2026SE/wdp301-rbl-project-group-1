import {
  BookingStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';

export interface BookingResultData {
  id: string;
  studentId: string;
  tutorId: string;
  subjectId: string | null;
  mode: TutoringMode;
  status: BookingStatus;
  price: number | null;
  message: string | null;
  createdAt: Date;
  student: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  };
  tutor: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  subject: {
    id: string;
    name: string;
    slug: string;
  } | null;
  scheduleRules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}
