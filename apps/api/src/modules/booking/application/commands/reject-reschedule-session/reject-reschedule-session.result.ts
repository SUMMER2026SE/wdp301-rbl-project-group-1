import { SessionStatus } from '../../../../../shared/domain/enums/enums';

export class RejectRescheduleSessionResult {
  constructor(
    public readonly sessionId: string,
    public readonly status: SessionStatus,
  ) {}
}
