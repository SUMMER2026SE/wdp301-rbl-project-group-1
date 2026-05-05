export interface SessionStatus {
    type: 'upcoming' | 'completed' | 'absent';
    label: string;
    color: string;
}

export interface CourseSession {
    id: string;
    sessionNumber: number;
    title: string;
    description: string;
    date: string;
    time: string;
    status: SessionStatus;
    meetLink?: string;
    videoLink?: string;
}

export interface AssignmentStatus {
    type: 'open' | 'not-submitted' | 'overdue' | 'submitted';
    label: string;
    color: string;
}

export interface Assignment {
    id: string;
    title: string;
    type: 'quiz' | 'exercise' | 'essay';
    typeLabel: string;
    status: AssignmentStatus;
    dueDate?: string;
    dueTime?: string;
    duration?: string;
    questionCount?: number;
    score?: number;
    maxScore?: number;
    description?: string;
}

export interface QuizStatus {
    type: 'open' | 'not-open' | 'submitted';
    label: string;
    color: string;
}

export interface Quiz {
    id: string;
    title: string;
    type: 'quiz' | 'midterm' | 'final';
    typeLabel: string;
    status: QuizStatus;
    duration: string;
    questionCount: number;
    scheduledDate?: string;
    scheduledTime?: string;
    submittedDate?: string;
    score?: number;
    maxScore?: number;
    description?: string;
}

export interface AttendanceStats {
    percentage: number;
    totalSessions: number;
    attended: number;
    absent: number;
}

export interface GradeItem {
    id: string;
    name: string;
    weight: number; // percentage
    score: number;
    maxScore: number;
    feedback?: string;
}

export interface GradeStats {
    averageScore: number;
    maxScore: number;
    completedCount: number;
}

export interface GradeTrend {
    label: string;
    score: number;
}

export type DocumentType = 'pdf' | 'video' | 'reference';

export interface Document {
    id: string;
    title: string;
    type: DocumentType;
    fileType: string; // PDF, MP4, DOCX, etc.
    fileSize?: string; // "2.4 MB"
    duration?: string; // "45:20" for videos
    previewUrl?: string;
    downloadUrl?: string;
}

export interface DocumentCategory {
    type: DocumentType;
    label: string;
    icon: string;
    iconColor: string;
    documents: Document[];
}

export interface TutoringCourse {
    id: string;
    title: string;
    tutorName: string;
    tutorAvatar: string;
    courseImage: string;
    schedule: string;
    platform: string;
    status: string;
    goal: string;
    sessions: CourseSession[];
    attendance: AttendanceStats;
    assignments: Assignment[];
    quizzes: Quiz[];
    upcomingAssignments: Assignment[];
    upcomingQuizzes: Quiz[];
    gradeStats: GradeStats;
    gradeTrend: GradeTrend[];
    gradeItems: GradeItem[];
    documentCategories: DocumentCategory[];
}