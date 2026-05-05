export interface Lesson {
    id: string
    title: string
    type: "video" | "pdf" | "quiz"
    duration?: string
    pageCount?: number
    questionCount?: number
    status: "completed" | "in-progress" | "locked" | "not-started"
}

export interface Chapter {
    id: string
    number: number
    title: string
    lessons: Lesson[]
}

export interface Course {
    id: string
    title: string
    tutorName: string
    tutorAvatar: string
    chapters: Chapter[]
    totalLessons: number
    completedLessons: number
    progress: number
    onlineClass?: {
        platform: string
        schedule: string
        meetLink?: string
    }
    relatedDocuments?: {
        id: string
        name: string
        size: string
        url: string
    }[]
}