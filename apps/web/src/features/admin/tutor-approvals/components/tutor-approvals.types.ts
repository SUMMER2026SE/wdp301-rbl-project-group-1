import type { TutorApplicationResponseDto } from "@/src/features/tutor-application/tutorApplicationApi";

export type TutorCertificate = "degree" | "pedagogy" | "language";

/**
 * Re-export the API response DTO as the canonical type
 * used across all tutor-approval components.
 */
export type TutorApplication = TutorApplicationResponseDto;
