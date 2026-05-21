"use client";

import { TutorListContainer } from "@/src/features/student/tutors/components";
import { MOCK_TUTORS } from "@/src/features/student/tutors/mock-data";

export default function FindTutorPage() {
  return <TutorListContainer tutors={MOCK_TUTORS} />;
}
