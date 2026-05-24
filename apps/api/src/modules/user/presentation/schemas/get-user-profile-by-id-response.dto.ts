import { createZodDto } from 'nestjs-zod';
import { Gender, UserRole } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

// ─── Public Profile schema ───────────────────────────────────────────────────────────
const PublicProfileSchema = z
  .object({
    nickname: z.string().meta({ example: 'johndoe' }),
    avatarUrl: z
      .string()
      .url()
      .nullable()
      .meta({ example: 'https://example.com/avatar.jpg' }),
    dateOfBirth: z.string().date().meta({ example: '1990-01-01' }),
    gender: z.nativeEnum(Gender).nullable().meta({ example: Gender.MALE }),
  })
  .meta({ id: 'PublicProfileDto' });

// ─── Tutor schema ─────────────────────────────────────────────────────────────
const TutorInfoSchema = z
  .object({
    bio: z.string().nullable().meta({ example: 'Experienced math tutor' }),
    specialization: z.string().nullable().meta({ example: 'Mathematics' }),
    experience: z.number().int().nullable().meta({ example: 5 }),
    education: z.string().nullable().meta({ example: 'M.Sc. Mathematics' }),
    pricePerHour: z.number().nullable().meta({ example: 150000 }),
    rating: z.number().meta({ example: 4.8 }),
    reviewCount: z.number().int().meta({ example: 42 }),
    studentCount: z.number().int().meta({ example: 100 }),
  })
  .meta({ id: 'PublicTutorInfoDto' });

// ─── Subject / Grade ref schemas ─────────────────────────────────────────────
const SubjectRefSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    name: z.string().meta({ example: 'Toán' }),
    slug: z.string().meta({ example: 'toan' }),
  })
  .meta({ id: 'PublicSubjectRefDto' });

const GradeRefSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def789' }),
    name: z.string().meta({ example: 'Lớp 11' }),
    slug: z.string().meta({ example: 'lop-11' }),
    order: z.number().int().meta({ example: 11 }),
  })
  .meta({ id: 'PublicGradeRefDto' });

// ─── Student schema ───────────────────────────────────────────────────────────
const StudentInfoSchema = z
  .object({
    school: z.string().nullable().meta({ example: 'Hanoi High School' }),
    learningGoal: z
      .string()
      .nullable()
      .meta({ example: 'Pass university entrance exam' }),
    subjects: z
      .array(SubjectRefSchema)
      .meta({ description: 'Enrolled subjects' }),
    grades: z.array(GradeRefSchema).meta({ description: 'Grade levels' }),
  })
  .meta({ id: 'PublicStudentInfoDto' });

// ─── Main response schema ─────────────────────────────────────────────────────
export const GetUserProfileByIdResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    role: z.nativeEnum(UserRole).meta({ example: UserRole.STUDENT }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
    profile: PublicProfileSchema.nullable(),
    tutor: TutorInfoSchema.nullable(),
    student: StudentInfoSchema.nullable(),
  })
  .meta({ id: 'GetUserProfileByIdResponseDto' });

export class GetUserProfileByIdResponseDto extends createZodDto(
  GetUserProfileByIdResponseSchema,
) {}
