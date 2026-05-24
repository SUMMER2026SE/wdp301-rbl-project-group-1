export type TutorCertificate = "degree" | "pedagogy" | "language";

export type TutorApplication = {
  name: string;
  email: string;
  subjects: string[];
  certificates: TutorCertificate[];
  submittedAt: string;
};
