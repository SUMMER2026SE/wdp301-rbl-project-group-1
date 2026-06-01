import {
  RequestStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';
import {
  ScheduleRuleInput,
  TutorRequest,
} from '../entities/tutor-request.entity';
import { TutorBid } from '../entities/tutor-bid.entity';

export type CreateTutorRequestData = {
  studentId: string;
  subjectId?: string;
  title: string;
  description: string;
  mode: TutoringMode;
  budget?: number;
  scheduleRules?: ScheduleRuleInput[];
};

export type SetTutorBidData = {
  requestId: string;
  tutorId: string;
  proposedPrice?: number;
  message?: string;
};

export type AcceptTutorBidData = {
  requestId: string;
  bidId: string;
  studentId: string;
};

export type AcceptedTutorBid = {
  bid: TutorBid;
  requestStatus: RequestStatus;
};

export const ITutorRequestRepository = Symbol('ITutorRequestRepository');

export interface ITutorRequestRepository {
  createRequest(data: CreateTutorRequestData): Promise<TutorRequest>;
  findOpenRequestById(id: string): Promise<TutorRequest | null>;
  findById(id: string): Promise<TutorRequest | null>;
  setBid(data: SetTutorBidData): Promise<TutorBid>;
  acceptBid(data: AcceptTutorBidData): Promise<AcceptedTutorBid | null>;
}
