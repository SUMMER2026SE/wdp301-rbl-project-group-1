import type { AcademicCatalogItem, TutorResponseDto } from "../tutorApi";
import type { Tutor } from "../types";

const DEFAULT_AVATAR_NAME = "Tutor";
const FALLBACK_TEXT = "Chưa cập nhật";

const buildAvatarUrl = (name: string, avatarUrl?: string | null) => {
  if (avatarUrl) return avatarUrl;

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || DEFAULT_AVATAR_NAME,
  )}`;
};

const mapCatalogNames = (
  ...sources: Array<AcademicCatalogItem[] | AcademicCatalogItem | null | undefined>
) => {
  const names = sources.flatMap((source) => {
    if (!source) return [];
    return Array.isArray(source) ? source.map((item) => item.name) : [source.name];
  });

  return Array.from(new Set(names.filter(Boolean)));
};

export const mapTutorResponseToTutor = (tutor: TutorResponseDto): Tutor => {
  const name = tutor.nickname?.trim() || "Gia sư";
  const specialization = tutor.specialization?.trim() || "";
  const experienceText =
    typeof tutor.experience === "number"
      ? `${tutor.experience} năm kinh nghiệm`
      : FALLBACK_TEXT;

  return {
    id: tutor.id,
    name,
    avatar: buildAvatarUrl(name, tutor.avatarUrl),
    isOnline: false,
    rating: tutor.rating ?? 0,
    reviewCount: tutor.reviewCount ?? 0,
    specialty: specialization || FALLBACK_TEXT,
    experience: experienceText,
    education: tutor.education ?? FALLBACK_TEXT,
    pricePerHour: tutor.pricePerHour ?? 0,
    skills: specialization ? [specialization] : [],
    subjects: mapCatalogNames(tutor.subjects, tutor.subject),
    grades: mapCatalogNames(tutor.grades, tutor.grade),
    bio: tutor.bio ?? undefined,
    studentCount:
      tutor.studentCount !== undefined && tutor.studentCount !== null
        ? `${tutor.studentCount}`
        : undefined,
  };
};
