import { RegisterFormData } from "@/src/features/auth/schemas/authSchemas";

export const DEFAULT_REGISTER_FORM_VALUES: RegisterFormData = {
  fullname: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
  subjectIds: [],
  gradeIds: [],
  school: "",
  learningGoal: "",
  termsAccepted: undefined as unknown as boolean,
};
