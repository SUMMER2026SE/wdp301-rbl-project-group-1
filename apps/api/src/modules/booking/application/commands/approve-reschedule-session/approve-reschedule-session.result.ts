import { SessionStatus } from '../../../../../shared/domain/enums/enums';

export class ApproveRescheduleSessionResult {
  constructor(
    public readonly sessionId: string,
    public readonly status: SessionStatus,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly proposedStartTime: string | null,
    public readonly proposedEndTime: string | null,
    public readonly proposedReason: string | null,
  ) {}
}
