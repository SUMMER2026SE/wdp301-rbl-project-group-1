import {
  AssessmentType,
  GradingPolicy,
  QuestionDifficulty,
} from '../../../../shared/domain/enums/enums';

// ── Assessment ──

export type PrismaAssessmentRecord = {
  id: string;
  courseId: string;
  lessonId: string | null;
  title: string;
  description: string | null;
  type: AssessmentType;
  maxAttempts: number | null;
  timeLimit: number | null;
  isRandomized: boolean;
  shuffleOptions: boolean;
  antiCheat: boolean;
  passScore: number | null;
  gradingPolicy: GradingPolicy;
  createdAt: Date;
  updatedAt: Date;
};

export type AssessmentWriteData = {
  id: string;
  courseId: string;
  lessonId?: string | null;
  title: string;
  description?: string | null;
  type: AssessmentType;
  maxAttempts?: number | null;
  timeLimit?: number | null;
  isRandomized: boolean;
  shuffleOptions: boolean;
  antiCheat: boolean;
  passScore?: number | null;
  gradingPolicy: GradingPolicy;
};

// ── AssessmentBankConfig ──

export type PrismaAssessmentBankConfigRecord = {
  id: string;
  assessmentId: string;
  bankId: string;
  difficulty: QuestionDifficulty | null;
  count: number;
  pointsPerQuestion: number;
};

export type AssessmentBankConfigWriteData = {
  id: string;
  assessmentId: string;
  bankId: string;
  difficulty?: QuestionDifficulty | null;
  count: number;
  pointsPerQuestion: number;
};
