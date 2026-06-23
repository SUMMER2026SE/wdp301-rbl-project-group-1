export interface ReviewResultData {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  student: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  };
}
