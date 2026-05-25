import { AssessmentBankConfig } from '../entities/assessment-bank-config.entity';
import { Question } from '../entities/question.entity';

export interface RandomizedQuestion {
  question: Question;
  /** Points override from bank config */
  assignedPoints: number;
}

/**
 * Domain service: randomizes questions from question banks
 * based on AssessmentBankConfig settings.
 */
export class QuestionRandomizerService {
  /**
   * Selects and randomizes questions from bank pools based on configs.
   *
   * @param configs - bank pull configurations (difficulty filter, count, points)
   * @param bankQuestionsMap - map of bankId → all questions in that bank
   * @param isRandomized - whether to shuffle the final question list
   * @param shuffleOptions - whether to shuffle option order within each question
   */
  static randomize(
    configs: AssessmentBankConfig[],
    bankQuestionsMap: Map<string, Question[]>,
    isRandomized: boolean,
    shuffleOptions: boolean,
  ): RandomizedQuestion[] {
    const result: RandomizedQuestion[] = [];

    for (const config of configs) {
      const bankQuestions = bankQuestionsMap.get(config.bankId) ?? [];

      // Filter by difficulty if specified
      let eligible = bankQuestions;
      if (config.difficulty) {
        eligible = bankQuestions.filter(
          (q) => q.difficulty === config.difficulty,
        );
      }

      // Random pick `count` questions (Fisher-Yates shuffle + slice)
      const shuffled = QuestionRandomizerService.shuffle([...eligible]);
      const picked = shuffled.slice(0, config.count);

      for (const question of picked) {
        result.push({
          question,
          assignedPoints: config.pointsPerQuestion,
        });
      }
    }

    // Shuffle entire question list if isRandomized
    const finalList = isRandomized
      ? QuestionRandomizerService.shuffle(result)
      : result;

    // Shuffle options within each question if shuffleOptions
    if (shuffleOptions) {
      for (const item of finalList) {
        item.question.updateOptions(
          QuestionRandomizerService.shuffle([...item.question.options]),
        );
      }
    }

    return finalList;
  }

  /**
   * Fisher-Yates shuffle (unbiased)
   */
  private static shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
