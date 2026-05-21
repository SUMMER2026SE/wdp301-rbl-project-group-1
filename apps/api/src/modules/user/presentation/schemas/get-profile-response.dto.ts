import { createZodDto } from 'nestjs-zod';
import { Gender, UserRole } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

// ─── Profile schema ───────────────────────────────────────────────────────────
const ProfileSchema = z
  .object({
    nickname: z.string().meta({ example: 'johndoe' }),
    avatarUrl: z
      .string()
      .url()
      .nullable()
      .meta({ example: 'https://example.com/avatar.jpg' }),
    phone: z.string().meta({ example: '+84912345678' }),
    dateOfBirth: z.string().date().meta({ example: '1990-01-01' }),
    gender: z.nativeEnum(Gender).nullable().meta({ example: Gender.MALE }),
    address: z.string().nullable().meta({ example: '123 Main St' }),
  })
  .meta({ id: 'GetMeProfileDto' });

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
  .meta({ id: 'GetMeTutorInfoDto' });

// ─── Subject / Grade ref schemas ─────────────────────────────────────────────
const SubjectRefSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    name: z.string().meta({ example: 'Toán' }),
    slug: z.string().meta({ example: 'toan' }),
  })
  .meta({ id: 'SubjectRefDto' });

const GradeRefSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def789' }),
    name: z.string().meta({ example: 'Lớp 11' }),
    slug: z.string().meta({ example: 'lop-11' }),
    order: z.number().int().meta({ example: 11 }),
  })
  .meta({ id: 'GradeRefDto' });

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
  .meta({ id: 'GetMeStudentInfoDto' });

// ─── Parent schema ────────────────────────────────────────────────────────────
const ParentInfoSchema = z
  .object({
    phone: z.string().nullable().meta({ example: '+84987654321' }),
    address: z.string().nullable().meta({ example: '456 Elm St' }),
  })
  .meta({ id: 'GetMeParentInfoDto' });

// ─── Main response schema ─────────────────────────────────────────────────────
export const GetProfileResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    email: z.string().email().meta({ example: 'user@example.com' }),
    role: z.nativeEnum(UserRole).meta({ example: UserRole.STUDENT }),
    isActive: z.boolean().meta({ example: true }),
    isVerified: z.boolean().meta({ example: true }),
    isFlag: z.boolean().meta({ example: false }),
    reportCount: z.number().int().meta({ example: 0 }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
    profile: ProfileSchema.nullable(),
    tutor: TutorInfoSchema.nullable(),
    student: StudentInfoSchema.nullable(),
    parent: ParentInfoSchema.nullable(),
  })
  .meta({ id: 'GetProfileResponseDto' });

export class GetProfileResponseDto extends createZodDto(
  GetProfileResponseSchema,
) {}
