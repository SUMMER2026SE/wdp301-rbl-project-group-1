import { BaseEntity } from '../../../../shared/domain/entities/base-entity';

export interface TutorProps {
  userId: string;
  bio?: string | null;
  specialization?: string | null;
  experience?: number | null;
  education?: string | null;
  pricePerHour?: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
}

export class Tutor extends BaseEntity<string> {
  private props: TutorProps;

  private constructor(id: string, props: TutorProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: TutorProps): Tutor {
    return new Tutor(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get bio(): string | null | undefined {
    return this.props.bio;
  }

  get specialization(): string | null | undefined {
    return this.props.specialization;
  }

  get experience(): number | null | undefined {
    return this.props.experience;
  }

  get education(): string | null | undefined {
    return this.props.education;
  }

  get pricePerHour(): number | null | undefined {
    return this.props.pricePerHour;
  }

  get rating(): number {
    return this.props.rating;
  }

  get reviewCount(): number {
    return this.props.reviewCount;
  }

  get studentCount(): number {
    return this.props.studentCount;
  }

  updateProfile(
    bio: string | null,
    specialization: string | null,
    education: string | null,
    experience: number | null,
  ): void {
    this.props.bio = bio;
    this.props.specialization = specialization;
    this.props.education = education;
    this.props.experience = experience;
  }

  setPrice(pricePerHour: number): void {
    this.props.pricePerHour = pricePerHour;
  }

  updateRating(newRating: number, totalReviews: number): void {
    this.props.rating = newRating;
    this.props.reviewCount = totalReviews;
  }

  incrementStudentCount(): void {
    this.props.studentCount += 1;
  }
}
