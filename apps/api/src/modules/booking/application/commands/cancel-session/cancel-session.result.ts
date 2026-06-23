import { SessionStatus } from '../../../../../shared/domain/enums/enums';

export class CancelSessionResult {
  constructor(
    public readonly sessionId: string,
    public readonly status: SessionStatus,
    public readonly cancelledByUserId: string,
    public readonly reason: string,
    public readonly cancelledAt: string,
    public readonly startTime: string,
    public readonly hoursUntilStart: number,
    public readonly isLateCancellation: boolean,
    public readonly penaltyAmount: number,
  ) {}
}
