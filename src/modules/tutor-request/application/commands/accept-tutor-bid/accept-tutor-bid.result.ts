import {
  BidStatus,
  RequestStatus,
} from '../../../../../shared/domain/enums/enums';

export class AcceptTutorBidResult {
  constructor(
    public readonly id: string,
    public readonly requestId: string,
    public readonly tutorId: string,
    public readonly proposedPrice: number | null,
    public readonly message: string | null,
    public readonly status: BidStatus,
    public readonly requestStatus: RequestStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
