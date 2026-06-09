import { BidStatus } from '../../../../shared/domain/enums/enums';

export type TutorBidProps = {
  id: string;
  requestId: string;
  tutorId: string;
  proposedPrice: number | null;
  message: string | null;
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class TutorBid {
  readonly id: string;
  readonly requestId: string;
  readonly tutorId: string;
  readonly proposedPrice: number | null;
  readonly message: string | null;
  readonly status: BidStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: TutorBidProps) {
    this.id = props.id;
    this.requestId = props.requestId;
    this.tutorId = props.tutorId;
    this.proposedPrice = props.proposedPrice;
    this.message = props.message;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
