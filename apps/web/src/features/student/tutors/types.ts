export interface TeachingExperience {
  year: string;
  position: string;
  school: string;
  description: string;
  isCurrent?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  image?: string;
}

export interface Review {
  id: string;
  studentName: string;
  role: string;
  rating: number;
  content: string;
  createdAt: string;
  avatar?: string;
}

export interface ActiveCourse {
  id: string;
  title: string;
  image: string;
  lessonCount: number;
  studentText: string;
  duration: string;
  schedule: string;
  price: number;
}

export interface TutorAvailability {
  days: string[];
  periods: AvailabilityPeriod[];
}

export interface AvailabilityPeriod {
  label: string;
  slots: boolean[];
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  specialty: string;
  experience: string;
  education: string;
  pricePerHour: number;
  skills: string[];
  subjects: string[];
  grades: string[];
  bio?: string;
  teachingExperience?: TeachingExperience[];
  certifications?: Certification[];
  reviews?: Review[];
  teachingHours?: string;
  studentCount?: string;
  activeCourses?: ActiveCourse[];
  availability?: TutorAvailability;
}

export interface FilterState {
  subjects: string[];
  levels: string[];
  priceRange: [number, number];
  rating: number;
  search: string;
  sortBy: string;
}
