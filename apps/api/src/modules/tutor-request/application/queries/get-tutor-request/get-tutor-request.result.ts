import {
  BidStatus,
  RequestStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';

export class TutorBidResultData {
  constructor(
    public readonly id: string,
    public readonly requestId: string,
    public readonly tutorId: string,
    public readonly proposedPrice: number | null,
    public readonly message: string | null,
    public readonly status: BidStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly tutor: {
      name: string | null;
      avatarUrl: string | null;
      rating: number;
      reviewCount: number;
    },
  ) {}
}

export class GetTutorRequestResult {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly subjectId: string | null,
    public readonly gradeId: string | null,
    public readonly title: string,
    public readonly description: string,
    public readonly mode: TutoringMode,
    public readonly budget: number | null,
    public readonly status: RequestStatus,
    public readonly totalSessions: number | null,
    public readonly createdAt: Date,
    public readonly bids: TutorBidResultData[],
    public readonly subject: { id: string; name: string; slug: string } | null,
    public readonly grade: {
      id: string;
      name: string;
      slug: string;
      order: number;
    } | null,
  ) {}
}
