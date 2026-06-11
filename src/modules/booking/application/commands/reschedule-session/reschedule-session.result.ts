import { SessionStatus } from '../../../../../shared/domain/enums/enums';

export class RescheduleSessionResult {
  constructor(
    public readonly sessionId: string,
    public readonly status: SessionStatus,
    public readonly proposedStartTime: string | null,
    public readonly proposedEndTime: string | null,
    public readonly proposedReason: string | null,
  ) {}
}
