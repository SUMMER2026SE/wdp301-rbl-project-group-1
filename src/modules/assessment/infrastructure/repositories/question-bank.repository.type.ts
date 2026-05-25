import {
  QuestionDifficulty,
  QuestionType,
} from '../../../../shared/domain/enums/enums';

// ── Question Bank ──

export type PrismaQuestionBankRecord = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type QuestionBankWriteData = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
};

// ── Question ──

export type PrismaOptionRecord = {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
};

export type PrismaQuestionRecord = {
  id: string;
  assessmentId: string | null;
  bankId: string | null;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  content: string;
  points: number;
  orderIndex: number;
  options: PrismaOptionRecord[];
};

export type QuestionWriteData = {
  id: string;
  assessmentId?: string | null;
  bankId?: string | null;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  content: string;
  points: number;
  orderIndex: number;
};

export type OptionWriteData = {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
};
