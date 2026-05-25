import { RandomizedQuestion } from '../../../domain/services/question-randomizer.service';

export class StartAttemptResult {
  constructor(
    public readonly attemptId: string,
    public readonly questions: RandomizedQuestion[],
  ) {}
}
