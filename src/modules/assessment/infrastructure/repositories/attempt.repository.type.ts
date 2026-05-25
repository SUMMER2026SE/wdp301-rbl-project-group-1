// ── Attempt ──

export type PrismaAttemptRecord = {
  id: string;
  assessmentId: string;
  studentId: string;
  startTime: Date;
  endTime: Date | null;
  score: number | null;
  isPassed: boolean | null;
};

export type AttemptWriteData = {
  id: string;
  assessmentId: string;
  studentId: string;
  startTime?: Date;
  endTime?: Date | null;
  score?: number | null;
  isPassed?: boolean | null;
};

// ── AttemptAnswer ──

export type PrismaAttemptAnswerRecord = {
  id: string;
  attemptId: string;
  questionId: string;
  optionIds: string[];
  textAnswer: string | null;
  isCorrect: boolean | null;
  points: number | null;
};

export type AttemptAnswerWriteData = {
  id: string;
  attemptId: string;
  questionId: string;
  optionIds: string[];
  textAnswer?: string | null;
  isCorrect?: boolean | null;
  points?: number | null;
};

// ── GradebookRecord ──

export type PrismaGradebookRecordRecord = {
  id: string;
  studentId: string;
  courseId: string;
  assessmentId: string;
  finalScore: number;
  isPassed: boolean;
  bestAttemptId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GradebookRecordWriteData = {
  id: string;
  studentId: string;
  courseId: string;
  assessmentId: string;
  finalScore: number;
  isPassed: boolean;
  bestAttemptId?: string | null;
};
