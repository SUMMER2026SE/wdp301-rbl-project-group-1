import type { TutorResponseDto } from "../tutorApi";
import type { Tutor } from "../types";

const DEFAULT_AVATAR_NAME = "Tutor";

const buildAvatarUrl = (name: string, avatarUrl?: string | null) => {
  if (avatarUrl) return avatarUrl;

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || DEFAULT_AVATAR_NAME,
  )}`;
};

export const mapTutorResponseToTutor = (tutor: TutorResponseDto): Tutor => {
  const name = tutor.nickname?.trim() || "Gia su";
  const specialization = tutor.specialization?.trim() || "";
  const experienceText =
    typeof tutor.experience === "number"
      ? `${tutor.experience} nam kinh nghiem`
      : "";

  return {
    id: tutor.id,
    name,
    avatar: buildAvatarUrl(name, tutor.avatarUrl),
    isOnline: false,
    rating: tutor.rating ?? 0,
    reviewCount: tutor.reviewCount ?? 0,
    specialty: specialization || "Gia su",
    experience: experienceText,
    education: tutor.education ?? "",
    pricePerHour: tutor.pricePerHour ?? 0,
    skills: specialization ? [specialization] : [],
    bio: tutor.bio ?? undefined,
    studentCount:
      tutor.studentCount !== undefined && tutor.studentCount !== null
        ? `${tutor.studentCount}`
        : undefined,
  };
};
